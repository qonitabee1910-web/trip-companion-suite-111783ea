import { useMemo, useState } from "react";
import { format, startOfToday } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  getRayons,
  getDepartTimes,
  getServicesAll,
  getVehicleTypesAll,
} from "@/modules/shuttle/data/repository";
import {
  getBlockedSeats,
  getBookedSeats,
  setBlockedSeats,
  type SlotKey,
} from "@/modules/shuttle/data/inventory";
import { SeatMap } from "@/modules/shuttle/components/SeatMap";
import type { ServiceTier } from "@/modules/shuttle/data/services";
import { Calendar as CalendarIcon, PackageOpen, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminInventory = () => {
  const { toast } = useToast();
  const rayons = getRayons();
  const services = getServicesAll();
  const vehicles = getVehicleTypesAll();
  const times = getDepartTimes();

  const [date, setDate] = useState<Date>(startOfToday());
  const [time, setTime] = useState(times[0] ?? "06:00");
  const [rayonId, setRayonId] = useState(rayons[0]?.id ?? "A");
  const [vehicleId, setVehicleId] = useState<string>(vehicles[0]?.id ?? "hiace");
  const [tier, setTier] = useState<string>(services[0]?.tier ?? "reguler");
  const [tick, setTick] = useState(0); // force re-render after toggle

  const slot: SlotKey = useMemo(
    () => ({
      date: format(date, "yyyy-MM-dd"),
      time,
      rayonId,
      vehicleId,
      tier,
    }),
    [date, time, rayonId, vehicleId, tier],
  );

  const vehicle = vehicles.find((v) => v.id === vehicleId);
  const totalSeats = vehicle?.totalSeats ?? 0;

  const booked = getBookedSeats(slot);
  const blocked = getBlockedSeats(slot);
  const occupiedSet = new Set([...booked, ...blocked]);

  const handleToggle = (n: number) => {
    if (booked.includes(n)) {
      toast({ title: "Tidak bisa diubah", description: `Kursi ${n} sudah dipesan customer.`, variant: "destructive" });
      return;
    }
    const next = blocked.includes(n) ? blocked.filter((s) => s !== n) : [...blocked, n];
    setBlockedSeats(slot, next);
    setTick((t) => t + 1);
  };

  return (
    <AdminLayout title="Inventori Kursi">
      <div className="space-y-4 max-w-5xl mx-auto">
        <Card className="p-4 md:p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-3">
            <PackageOpen className="h-4 w-4 text-primary" /> Pilih Slot
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="col-span-2 md:col-span-1">
              <Label className="text-xs">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal h-10 mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "d MMM yyyy", { locale: localeId })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus locale={localeId} className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-xs">Jam</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{times.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Rayon</Label>
              <Select value={rayonId} onValueChange={setRayonId}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{rayons.map((r) => <SelectItem key={r.id} value={r.id}>{r.id} • {r.area}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Kendaraan</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.label} ({v.totalSeats})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Service</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{services.map((s) => <SelectItem key={s.tier} value={s.tier}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="font-semibold">Denah Kursi</h3>
              <p className="text-xs text-muted-foreground">Klik kursi kosong untuk blok manual. Kursi yang sudah dipesan customer terkunci.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary"><Lock className="h-3 w-3 mr-1" /> {booked.length} dipesan</Badge>
              <Badge variant="outline">{blocked.length} diblok admin</Badge>
              <Badge className="bg-success text-success-foreground">{Math.max(0, totalSeats - occupiedSet.size)} tersedia</Badge>
            </div>
          </div>

          {vehicle ? (
            <div key={tick} className="max-w-md mx-auto">
              <SeatMap
                vehicle={vehicle.id}
                totalSeats={totalSeats}
                occupied={occupiedSet}
                selected={blocked}
                maxSelect={totalSeats}
                onToggle={handleToggle}
                tier={tier as ServiceTier}
              />
              <p className="text-[11px] text-center text-muted-foreground mt-3">
                Warna biru = kursi yang sedang Anda blok. Klik lagi untuk lepas blok.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Kendaraan tidak ditemukan.</p>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
