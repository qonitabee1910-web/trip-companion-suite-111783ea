import { useMemo } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, isValid, isToday } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Ticket,
  DollarSign,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Plus,
  Image as ImageIcon,
  Armchair,
} from "lucide-react";
import {
  getBookings,
  getRayons,
  getServicesAll,
  getVehicleTypesAll,
  getDestinationStored,
} from "@/modules/shuttle/data/repository";
import { getSeatLayout } from "@/modules/shuttle/data/seatLayouts";
import type { ServiceTier } from "@/modules/shuttle/data/services";

const statusColor: Record<string, string> = {
  confirmed: "bg-primary/10 text-primary",
  done: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const AdminDashboard = () => {
  const bookings = getBookings();
  const rayons = getRayons();
  const services = getServicesAll();
  const vehicles = getVehicleTypesAll();
  const dest = getDestinationStored();

  const stats = useMemo(() => {
    const todays = bookings.filter((b) => {
      const d = parseISO(b.date);
      return isValid(d) && isToday(d);
    });
    const revenue = todays.reduce((sum, b) => sum + b.totalPrice, 0);
    return {
      todayCount: todays.length,
      revenue,
      rayonCount: rayons.length,
      serviceCount: services.filter((s) => s.active !== false).length,
    };
  }, [bookings, rayons, services]);

  const activeServices = services.filter((s) => s.active !== false);
  const activeVehicles = vehicles.filter((v) => v.active !== false);

  // Mismatch count: combinations where seat layout count != vehicle.totalSeats
  const mismatches = useMemo(() => {
    const list: { vehicleId: string; tier: string }[] = [];
    activeVehicles.forEach((v) => {
      activeServices.forEach((s) => {
        const layout = getSeatLayout(v.id, v.totalSeats, s.tier as ServiceTier);
        if (layout.seats.length !== v.totalSeats) list.push({ vehicleId: v.id, tier: s.tier });
      });
    });
    return list;
  }, [activeVehicles, activeServices]);

  const checklist = [
    { ok: !!dest.short, label: "Tujuan diatur", to: "/admin/shuttle/content" },
    { ok: rayons.length > 0, label: `Rayon (${rayons.length})`, to: "/admin/shuttle/rayons" },
    { ok: activeServices.length > 0, label: `Service aktif (${activeServices.length})`, to: "/admin/shuttle/services" },
    { ok: activeVehicles.length > 0, label: `Kendaraan aktif (${activeVehicles.length})`, to: "/admin/shuttle/vehicles" },
    { ok: mismatches.length === 0, label: `Seat layout sinkron`, to: "/admin/shuttle/seat-editor" },
  ];

  const completion = checklist.filter((c) => c.ok).length;
  const total = checklist.length;

  const latest = bookings.slice(0, 5);

  const cards = [
    { label: "Booking Hari Ini", value: stats.todayCount, icon: Ticket, color: "text-primary" },
    { label: "Revenue Hari Ini", value: `Rp${stats.revenue.toLocaleString("id-ID")}`, icon: DollarSign, color: "text-success" },
    { label: "Total Rayon", value: stats.rayonCount, icon: MapPin, color: "text-accent" },
    { label: "Service Aktif", value: stats.serviceCount, icon: Sparkles, color: "text-warning" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {cards.map((c) => (
            <Card key={c.label} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <c.icon className={`h-4 w-4 ${c.color}`} />
              </div>
              <p className="text-xl md:text-2xl font-bold">{c.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold">Setup Completeness</h2>
                <p className="text-xs text-muted-foreground">{completion}/{total} langkah selesai</p>
              </div>
              <Badge variant={completion === total ? "default" : "secondary"} className={completion === total ? "bg-success text-success-foreground" : ""}>
                {Math.round((completion / total) * 100)}%
              </Badge>
            </div>
            <ul className="space-y-2">
              {checklist.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="flex items-center justify-between gap-2 rounded-md p-2 hover:bg-muted/50">
                    <div className="flex items-center gap-2 text-sm">
                      {item.ok ? (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={item.ok ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>

            {mismatches.length > 0 && (
              <div className="mt-3 rounded-md border border-warning/40 bg-warning/10 p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-warning">{mismatches.length} kombinasi seat layout tidak sinkron kapasitas</p>
                  <p className="text-muted-foreground">Buka Seat Editor untuk sinkronkan.</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="font-semibold mb-3">Aksi Cepat</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" className="justify-start h-auto py-3">
                <Link to="/admin/shuttle/content">
                  <ImageIcon className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-xs font-semibold">Atur Konten</p>
                    <p className="text-[10px] text-muted-foreground">Hero & tujuan</p>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start h-auto py-3">
                <Link to="/admin/shuttle/rayons">
                  <Plus className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-xs font-semibold">Tambah Rayon</p>
                    <p className="text-[10px] text-muted-foreground">Area & jadwal</p>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start h-auto py-3">
                <Link to="/admin/shuttle/seat-editor">
                  <Armchair className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-xs font-semibold">Editor Kursi</p>
                    <p className="text-[10px] text-muted-foreground">Denah per tipe</p>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start h-auto py-3">
                <Link to="/admin/shuttle/inventory">
                  <Ticket className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-xs font-semibold">Inventori</p>
                    <p className="text-[10px] text-muted-foreground">Blok kursi</p>
                  </div>
                </Link>
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Booking Terbaru</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/shuttle/bookings">
                Lihat semua <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {latest.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              Belum ada booking. Coba pesan dari user flow shuttle.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Rayon</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latest.map((b) => {
                    const d = parseISO(b.date);
                    return (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs">{b.id}</TableCell>
                        <TableCell className="text-xs">
                          {isValid(d) ? format(d, "d MMM yyyy", { locale: localeId }) : "-"} • {b.time}
                        </TableCell>
                        <TableCell className="text-xs">{b.rayonName}</TableCell>
                        <TableCell className="text-xs">{b.vehicleLabel}</TableCell>
                        <TableCell className="text-right font-medium">
                          Rp{b.totalPrice.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColor[b.status]}>
                            {b.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
