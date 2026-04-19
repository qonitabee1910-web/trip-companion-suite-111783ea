import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Save, RotateCcw, Bus, Armchair, ExternalLink } from "lucide-react";
import { getVehicleTypesAll, saveVehicleTypes, resetSection } from "@/modules/shuttle/data/repository";
import type { VehicleType } from "@/modules/shuttle/data/services";
import { useToast } from "@/hooks/use-toast";

const AdminVehicles = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<VehicleType[]>(getVehicleTypesAll());

  const update = (idx: number, patch: Partial<VehicleType>) => {
    setVehicles((prev) => prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  };

  const handleSave = () => {
    saveVehicleTypes(vehicles);
    toast({ title: "Kendaraan disimpan" });
  };

  const handleReset = () => {
    resetSection("vehicles");
    setVehicles(getVehicleTypesAll());
    toast({ title: "Direset" });
  };

  return (
    <AdminLayout title="Kendaraan">
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Bus className="h-4 w-4 text-primary" /> Tipe Kendaraan
            </h2>
            <p className="text-xs text-muted-foreground">Atur kapasitas & harga dasar tiap tipe.</p>
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
                  <AlertDialogTitle>Reset Kendaraan?</AlertDialogTitle>
                  <AlertDialogDescription>Kembalikan ke default.</AlertDialogDescription>
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

        {vehicles.map((v, idx) => (
          <Card key={v.id} className="p-4 md:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs px-2 py-1 rounded bg-muted">{v.id}</span>
              <Button asChild variant="outline" size="sm">
                <Link to="/shuttle/seat-editor" target="_blank">
                  <Armchair className="h-4 w-4" /> Edit denah <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Label</Label>
                <Input value={v.label} onChange={(e) => update(idx, { label: e.target.value })} />
              </div>
              <div>
                <Label>Nama Kendaraan</Label>
                <Input value={v.vehicleName} onChange={(e) => update(idx, { vehicleName: e.target.value })} />
              </div>
              <div>
                <Label>Kapasitas Kursi</Label>
                <Input
                  type="number"
                  value={v.totalSeats}
                  onChange={(e) => update(idx, { totalSeats: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Harga Dasar (Rp)</Label>
                <Input
                  type="number"
                  value={v.basePrice}
                  onChange={(e) => update(idx, { basePrice: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea
                rows={2}
                value={v.description}
                onChange={(e) => update(idx, { description: e.target.value })}
              />
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminVehicles;
