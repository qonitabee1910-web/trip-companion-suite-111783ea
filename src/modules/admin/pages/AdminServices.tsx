import { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Save, RotateCcw, Sparkles } from "lucide-react";
import { getServicesAll, saveServices, resetSection } from "@/modules/shuttle/data/repository";
import type { ServiceConfig } from "@/modules/shuttle/data/services";
import { useToast } from "@/hooks/use-toast";

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceConfig[]>(getServicesAll());

  const update = (idx: number, patch: Partial<ServiceConfig>) => {
    setServices((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const handleSave = () => {
    saveServices(services);
    toast({ title: "Service disimpan", description: "Perubahan langsung tampil di user flow." });
  };

  const handleReset = () => {
    resetSection("services");
    setServices(getServicesAll());
    toast({ title: "Direset", description: "Service dikembalikan ke default." });
  };

  return (
    <AdminLayout title="Service">
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Konfigurasi Service Tier
            </h2>
            <p className="text-xs text-muted-foreground">Multiplier mengalikan harga dasar kendaraan.</p>
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
                  <AlertDialogTitle>Reset Service?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua service dikembalikan ke nilai default.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" /> Simpan
            </Button>
          </div>
        </div>

        {services.map((s, idx) => (
          <Card key={s.tier} className="p-4 md:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-1 rounded bg-muted">{s.tier}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Label</Label>
                <Input value={s.label} onChange={(e) => update(idx, { label: e.target.value })} />
              </div>
              <div>
                <Label>Harga Multiplier</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={s.priceMultiplier}
                  onChange={(e) => update(idx, { priceMultiplier: Number(e.target.value) })}
                />
              </div>
              <div className="md:col-span-1">
                <Label>Deskripsi</Label>
                <Input value={s.description} onChange={(e) => update(idx, { description: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Fitur (1 baris = 1 fitur)</Label>
              <Textarea
                rows={4}
                value={s.features.join("\n")}
                onChange={(e) =>
                  update(idx, { features: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })
                }
              />
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
