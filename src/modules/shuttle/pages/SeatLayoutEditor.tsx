import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, RotateCcw, Copy, Download, ArrowUp, ArrowDown, Save, Eraser } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DraggableSeat } from "../components/DraggableSeat";
import {
  LAYOUT_PRESETS,
  LAYOUT_LABELS,
  LAYOUT_KEYS,
  saveLayoutToStorage,
  loadLayoutFromStorage,
  clearLayoutFromStorage,
  hasStoredLayout,
  type SeatLayoutConfig,
  type SeatPosition,
  type LayoutKey,
} from "../data/seatLayouts";

export default function SeatLayoutEditor() {
  const [layoutKey, setLayoutKey] = useState<LayoutKey>("HIACE_REGULER");
  const [config, setConfig] = useState<SeatLayoutConfig>(() => {
    const stored = loadLayoutFromStorage("HIACE_REGULER");
    const base = stored || LAYOUT_PRESETS.HIACE_REGULER;
    return { ...base, seats: base.seats.map((s) => ({ ...s })) };
  });
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [snap, setSnap] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(() => hasStoredLayout("HIACE_REGULER"));
  const containerRef = useRef<HTMLDivElement>(null);

  const loadPreset = (key: LayoutKey) => {
    setLayoutKey(key);
    const stored = loadLayoutFromStorage(key);
    const base = stored || LAYOUT_PRESETS[key];
    setConfig({ ...base, seats: base.seats.map((s) => ({ ...s })) });
    const isCustomImg = !!stored?.image && stored.image !== LAYOUT_PRESETS[key].image;
    setCustomImage(isCustomImg ? stored!.image : null);
    setSelectedNum(null);
    setHasSaved(hasStoredLayout(key));
  };

  const resetToPreset = () => {
    const p = LAYOUT_PRESETS[layoutKey];
    setConfig({ ...p, seats: p.seats.map((s) => ({ ...s })) });
    setCustomImage(null);
    setSelectedNum(null);
  };

  const saveLayout = () => {
    const ok = saveLayoutToStorage(layoutKey, config, !!customImage);
    if (ok) {
      setHasSaved(true);
      toast.success(`Layout ${LAYOUT_LABELS[layoutKey]} disimpan — tampilan user diperbarui`);
    } else {
      toast.error("Gagal menyimpan (storage penuh?)");
    }
  };

  const clearSaved = () => {
    clearLayoutFromStorage(layoutKey);
    setHasSaved(false);
    resetToPreset();
    toast.success(`Simpanan ${LAYOUT_LABELS[layoutKey]} dihapus, kembali ke default`);
  };

  const updateSeat = (num: number, x: number, y: number) => {
    setConfig((c) => ({
      ...c,
      seats: c.seats.map((s) => (s.num === num ? { ...s, x, y } : s)),
    }));
  };

  const updateDriver = (x: number, y: number) => {
    setConfig((c) => ({ ...c, driverSeat: { x, y } }));
  };

  const addSeat = () => {
    setConfig((c) => {
      const nextNum = c.seats.length ? Math.max(...c.seats.map((s) => s.num)) + 1 : 1;
      return { ...c, seats: [...c.seats, { num: nextNum, x: 50, y: 50 }] };
    });
  };

  const removeSeat = (num: number) => {
    setConfig((c) => ({ ...c, seats: c.seats.filter((s) => s.num !== num) }));
    setSelectedNum(null);
  };

  const reorder = (num: number, dir: -1 | 1) => {
    setConfig((c) => {
      const idx = c.seats.findIndex((s) => s.num === num);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= c.seats.length) return c;
      const next = [...c.seats];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      // Renumber sequentially
      const renum = next.map((s, i) => ({ ...s, num: i + 1 }));
      return { ...c, seats: renum };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomImage(dataUrl);
      setConfig((c) => ({ ...c, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const exportSnippet = useMemo(() => {
    const seatsStr = config.seats
      .map((s) => `    { num: ${s.num}, x: ${s.x}, y: ${s.y} },`)
      .join("\n");
    return `export const ${layoutKey}_LAYOUT: SeatLayoutConfig = {
  image: ${layoutKey.toLowerCase()}Img,
  aspect: "${config.aspect}",
  driverSeat: { x: ${config.driverSeat.x}, y: ${config.driverSeat.y} },
  seats: [
${seatsStr}
  ],
};`;
  }, [config, layoutKey]);

  const copyExport = async () => {
    await navigator.clipboard.writeText(exportSnippet);
    toast.success("Snippet disalin ke clipboard");
  };

  const downloadExport = () => {
    const blob = new Blob([exportSnippet], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layoutKey.toLowerCase()}-layout.ts`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selected = config.seats.find((s) => s.num === selectedNum);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 p-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/shuttle"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">Seat Layout Editor</h1>
              {hasSaved && <Badge variant="secondary" className="text-[10px]">Tersimpan</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">Drag kursi di atas denah, lalu simpan atau export</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[340px_1fr]">
        {/* Control panel */}
        <div className="space-y-4">
          <Card className="space-y-3 p-4">
            <div>
              <Label>Varian Kendaraan & Service</Label>
              <Select value={layoutKey} onValueChange={(v) => loadPreset(v as LayoutKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LAYOUT_KEYS.map((k) => (
                    <SelectItem key={k} value={k}>{LAYOUT_LABELS[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Aspect Ratio</Label>
              <Input
                value={config.aspect}
                onChange={(e) => setConfig((c) => ({ ...c, aspect: e.target.value }))}
                placeholder="1/2.2"
              />
            </div>
            <div>
              <Label>Upload denah (opsional)</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              {customImage && <p className="mt-1 text-xs text-muted-foreground">Custom image aktif</p>}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="snap" className="cursor-pointer">Snap to grid (1%)</Label>
              <Switch id="snap" checked={snap} onCheckedChange={setSnap} />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={addSeat} size="sm" variant="outline"><Plus className="h-4 w-4" />Kursi</Button>
              <Button onClick={resetToPreset} size="sm" variant="outline"><RotateCcw className="h-4 w-4" />Reset</Button>
              <Button onClick={saveLayout} size="sm" className="col-span-2">
                <Save className="h-4 w-4" />Simpan ke tampilan user
              </Button>
              {hasSaved && (
                <Button onClick={clearSaved} size="sm" variant="ghost" className="col-span-2 text-destructive hover:text-destructive">
                  <Eraser className="h-4 w-4" />Hapus simpanan
                </Button>
              )}
            </div>
          </Card>

          {selected && (
            <Card className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Kursi #{selected.num}</h3>
                <Button onClick={() => removeSeat(selected.num)} size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X (%)</Label>
                  <Input
                    type="number"
                    value={selected.x}
                    onChange={(e) => updateSeat(selected.num, Number(e.target.value), selected.y)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Y (%)</Label>
                  <Input
                    type="number"
                    value={selected.y}
                    onChange={(e) => updateSeat(selected.num, selected.x, Number(e.target.value))}
                  />
                </div>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="mb-2 font-bold">Daftar Kursi ({config.seats.length})</h3>
            <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
              {config.seats.map((s) => (
                <div
                  key={s.num}
                  className={`flex items-center gap-2 rounded-md border p-2 text-xs ${
                    selectedNum === s.num ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <button className="flex-1 text-left" onClick={() => setSelectedNum(s.num)}>
                    <span className="font-bold">#{s.num}</span>{" "}
                    <span className="text-muted-foreground">({s.x}, {s.y})</span>
                  </button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => reorder(s.num, -1)}>
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => reorder(s.num, 1)}>
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-2 p-4">
            <h3 className="font-bold">Export</h3>
            <pre className="max-h-48 overflow-auto rounded-md bg-muted p-2 text-[10px]">
              <code>{exportSnippet}</code>
            </pre>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={copyExport} size="sm"><Copy className="h-4 w-4" />Copy</Button>
              <Button onClick={downloadExport} size="sm" variant="outline"><Download className="h-4 w-4" />Download</Button>
            </div>
          </Card>
        </div>

        {/* Canvas */}
        <Card className="p-4">
          <div
            ref={containerRef}
            className="relative mx-auto w-full max-w-[400px] rounded-xl bg-muted/30"
            style={{ aspectRatio: config.aspect }}
            onClick={() => setSelectedNum(null)}
          >
            <img
              src={config.image}
              alt="Denah"
              className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <DraggableSeat
              x={config.driverSeat.x}
              y={config.driverSeat.y}
              label="D"
              isDriver
              containerRef={containerRef}
              onMove={updateDriver}
              snap={snap ? 1 : 0}
            />
            {config.seats.map((s: SeatPosition) => (
              <DraggableSeat
                key={s.num}
                x={s.x}
                y={s.y}
                label={s.num}
                selected={selectedNum === s.num}
                containerRef={containerRef}
                onMove={(x, y) => updateSeat(s.num, x, y)}
                onSelect={() => setSelectedNum(s.num)}
                snap={snap ? 1 : 0}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Drag tombol untuk memindahkan • Klik untuk seleksi & edit manual
          </p>
        </Card>
      </main>
    </div>
  );
}
