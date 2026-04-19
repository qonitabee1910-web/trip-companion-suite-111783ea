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
import { Ticket, DollarSign, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { getBookings, getRayons, getServicesAll } from "@/modules/shuttle/data/repository";

const statusColor: Record<string, string> = {
  confirmed: "bg-primary/10 text-primary",
  done: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const AdminDashboard = () => {
  const bookings = getBookings();
  const rayons = getRayons();
  const services = getServicesAll();

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
      serviceCount: services.length,
    };
  }, [bookings, rayons, services]);

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
