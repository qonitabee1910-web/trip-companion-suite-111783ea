import { useMemo, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { AdminLayout } from "../components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Ticket, Trash2, RotateCcw } from "lucide-react";
import {
  getBookings,
  updateBookingStatus,
  deleteBooking,
  resetSection,
} from "@/modules/shuttle/data/repository";
import type { BookingStatus, ShuttleBooking } from "@/modules/shuttle/types/booking";
import { useToast } from "@/hooks/use-toast";

const statusColor: Record<BookingStatus, string> = {
  confirmed: "bg-primary/10 text-primary border-primary/30",
  done: "bg-success/10 text-success border-success/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

const AdminBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<ShuttleBooking[]>(getBookings());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (dateFilter && b.date !== dateFilter) return false;
      return true;
    });
  }, [bookings, statusFilter, dateFilter]);

  const refresh = () => setBookings(getBookings());

  const handleStatus = (id: string, status: BookingStatus) => {
    updateBookingStatus(id, status);
    refresh();
    toast({ title: "Status diperbarui", description: `${id} → ${status}` });
  };

  const handleDelete = (id: string) => {
    deleteBooking(id);
    refresh();
    toast({ title: "Booking dihapus" });
  };

  const handleResetAll = () => {
    resetSection("bookings");
    refresh();
    toast({ title: "Semua booking dihapus" });
  };

  return (
    <AdminLayout title="Booking">
      <div className="space-y-4 max-w-7xl mx-auto">
        <Card className="p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" /> Daftar Booking ({filtered.length})
            </h2>
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-auto"
              />
              {dateFilter && (
                <Button size="sm" variant="ghost" onClick={() => setDateFilter("")}>
                  Bersihkan
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <RotateCcw className="h-4 w-4" /> Hapus semua
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus semua booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetAll}>Hapus</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Penumpang</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Rayon</TableHead>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead className="text-center">Pax</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                      Tidak ada booking sesuai filter.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((b) => {
                  const d = parseISO(b.date);
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.id}</TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium">{b.customerName}</div>
                        <div className="text-muted-foreground">{b.customerPhone}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {isValid(d) ? format(d, "d MMM yyyy", { locale: localeId }) : "-"}
                        <div className="text-muted-foreground">{b.time}</div>
                      </TableCell>
                      <TableCell className="text-xs">{b.rayonName}</TableCell>
                      <TableCell className="text-xs">
                        {b.vehicleLabel} • {b.serviceLabel}
                      </TableCell>
                      <TableCell className="text-center">{b.pax}</TableCell>
                      <TableCell className="text-right font-medium">
                        Rp{b.totalPrice.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor[b.status]}>
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select value={b.status} onValueChange={(v) => handleStatus(b.id, v as BookingStatus)}>
                          <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(b.id)}
                          className="ml-1"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
