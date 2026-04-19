import { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, X, RotateCcw, Save, MapPin, Clock } from "lucide-react";
import {
  getRayons,
  saveRayons,
  getDepartTimes,
  saveDepartTimes,
  resetSection,
} from "@/modules/shuttle/data/repository";
import type { Rayon, RayonId } from "@/modules/shuttle/data/rayons";
import { useToast } from "@/hooks/use-toast";

const emptyRayon: Rayon = {
  id: "A",
  name: "",
  area: "",
  pickupPoints: [],
  color: "primary",
  estimateMin: 60,
  surcharge: 0,
};

const AdminRayons = () => {
  const { toast } = useToast();
  const [rayons, setRayons] = useState<Rayon[]>(getRayons());
  const [times, setTimes] = useState<string[]>(getDepartTimes());
  const [editing, setEditing] = useState<{ index: number; data: Rayon } | null>(null);
  const [newPickup, setNewPickup] = useState("");
  const [newTime, setNewTime] = useState("");

  const persistRayons = (next: Rayon[]) => {
    setRayons(next);
    saveRayons(next);
    toast({ title: "Rayon disimpan", description: `${next.length} rayon aktif.` });
  };

  const persistTimes = (next: string[]) => {
    const sorted = [...new Set(next)].sort();
    setTimes(sorted);
    saveDepartTimes(sorted);
  };

  const openNew = () => {
    setEditing({
      index: -1,
      data: { ...emptyRayon, id: (String.fromCharCode(65 + rayons.length) as RayonId) },
    });
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    const data = editing.data;
    if (!data.id || !data.name || !data.area) {
      toast({ title: "Lengkapi data", description: "ID, Nama, dan Area wajib.", variant: "destructive" });
      return;
    }
    const next = [...rayons];
    if (editing.index < 0) next.push(data);
    else next[editing.index] = data;
    persistRayons(next);
    setEditing(null);
  };

  const handleDelete = (idx: number) => {
    const next = rayons.filter((_, i) => i !== idx);
    persistRayons(next);
  };

  const addPickup = () => {
    if (!editing || !newPickup.trim()) return;
    setEditing({
      ...editing,
      data: { ...editing.data, pickupPoints: [...editing.data.pickupPoints, newPickup.trim()] },
    });
    setNewPickup("");
  };

  const removePickup = (i: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      data: {
        ...editing.data,
        pickupPoints: editing.data.pickupPoints.filter((_, idx) => idx !== i),
      },
    });
  };

  const addTime = () => {
    if (!/^\d{2}:\d{2}$/.test(newTime)) {
      toast({ title: "Format jam salah", description: "Gunakan HH:MM (cth 06:00).", variant: "destructive" });
      return;
    }
    persistTimes([...times, newTime]);
    setNewTime("");
  };

  const removeTime = (t: string) => persistTimes(times.filter((x) => x !== t));

  const handleReset = () => {
    resetSection("rayons");
    resetSection("times");
    setRayons(getRayons());
    setTimes(getDepartTimes());
    toast({ title: "Direset", description: "Data rayon & jam dikembalikan ke default." });
  };

  return (
    <AdminLayout title="Rayon & Jam">
      <div className="space-y-6 max-w-6xl mx-auto">
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Daftar Rayon
              </h2>
              <p className="text-xs text-muted-foreground">Kelola area & titik jemput.</p>
            </div>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" /> Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Rayon & Jam?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Semua perubahan akan dikembalikan ke default.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button size="sm" onClick={openNew}>
                <Plus className="h-4 w-4" /> Tambah
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead className="text-center">Titik</TableHead>
                  <TableHead className="text-center">Estimasi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rayons.map((r, idx) => (
                  <TableRow key={r.id + idx}>
                    <TableCell className="font-mono font-bold">{r.id}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.area}</TableCell>
                    <TableCell className="text-center">{r.pickupPoints.length}</TableCell>
                    <TableCell className="text-center">{r.estimateMin}m</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setEditing({ index: idx, data: r })}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(idx)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-primary" /> Jam Berangkat Global
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {times.map((t) => (
              <Badge key={t} variant="secondary" className="text-sm py-1.5 pl-3 pr-1 gap-1">
                {t}
                <button onClick={() => removeTime(t)} className="hover:bg-destructive/20 rounded p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {times.length === 0 && <p className="text-xs text-muted-foreground">Belum ada jam.</p>}
          </div>
          <div className="flex gap-2 max-w-xs">
            <Input
              placeholder="HH:MM"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              maxLength={5}
            />
            <Button onClick={addTime} size="sm">
              <Plus className="h-4 w-4" /> Tambah
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing && editing.index >= 0 ? "Edit Rayon" : "Tambah Rayon"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>ID (1 huruf)</Label>
                  <Input
                    value={editing.data.id}
                    maxLength={1}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        data: { ...editing.data, id: e.target.value.toUpperCase() as RayonId },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Estimasi (menit)</Label>
                  <Input
                    type="number"
                    value={editing.data.estimateMin}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        data: { ...editing.data, estimateMin: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Nama</Label>
                <Input
                  value={editing.data.name}
                  onChange={(e) =>
                    setEditing({ ...editing, data: { ...editing.data, name: e.target.value } })
                  }
                />
              </div>
              <div>
                <Label>Area</Label>
                <Input
                  value={editing.data.area}
                  onChange={(e) =>
                    setEditing({ ...editing, data: { ...editing.data, area: e.target.value } })
                  }
                />
              </div>
              <div>
                <Label>Titik Jemput</Label>
                <div className="flex flex-wrap gap-1.5 mb-2 mt-1">
                  {editing.data.pickupPoints.map((p, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                      {p}
                      <button onClick={() => removePickup(i)} className="hover:bg-destructive/20 rounded p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nama titik jemput"
                    value={newPickup}
                    onChange={(e) => setNewPickup(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPickup())}
                  />
                  <Button onClick={addPickup} size="sm" type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="h-4 w-4" /> Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminRayons;
