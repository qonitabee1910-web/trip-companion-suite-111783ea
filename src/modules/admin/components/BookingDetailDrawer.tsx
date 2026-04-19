import { format, parseISO, isValid } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Printer, User, Phone, MapPin, Calendar, Clock, Ticket, Armchair } from "lucide-react";
import { SeatMap } from "@/modules/shuttle/components/SeatMap";
import type { ShuttleBooking, BookingStatus } from "@/modules/shuttle/types/booking";
import type { ServiceTier } from "@/modules/shuttle/data/seatLayouts";
import { getVehicleTypeById } from "@/modules/shuttle/data/repository";

interface Props {
  booking: ShuttleBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColor: Record<BookingStatus, string> = {
  confirmed: "bg-primary/10 text-primary border-primary/30",
  done: "bg-success/10 text-success border-success/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

export function BookingDetailDrawer({ booking, open, onOpenChange }: Props) {
  if (!booking) return null;

  const d = parseISO(booking.date);
  const dateLabel = isValid(d)
    ? format(d, "EEEE, d MMMM yyyy", { locale: localeId })
    : booking.date;

  const vehicle = getVehicleTypeById(booking.vehicleId);
  const totalSeats = vehicle?.totalSeats ?? Math.max(...booking.seats, booking.pax);
  const occupied = new Set(booking.seats); // tampilkan kursi yang dipesan sebagai 'terisi' visual lain
  const selected = booking.seats;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto print:max-w-full print:shadow-none print:border-0"
      >
        <SheetHeader className="text-left">
          <div className="flex items-center justify-between gap-2">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" /> Detail Booking
              </SheetTitle>
              <SheetDescription className="font-mono text-xs">{booking.id}</SheetDescription>
            </div>
            <Badge variant="outline" className={statusColor[booking.status]}>
              {booking.status}
            </Badge>
          </div>
        </SheetHeader>

        {/* Printable area */}
        <div id="eticket-print" className="mt-4 space-y-5">
          {/* E-ticket header (only for print) */}
          <div className="hidden print:block text-center border-b pb-3 mb-3">
            <h1 className="text-2xl font-bold">E-TICKET SHUTTLE</h1>
            <p className="font-mono text-sm">{booking.id}</p>
          </div>

          {/* Passenger info */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Penumpang
            </h3>
            <div className="rounded-lg border bg-card p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{booking.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${booking.customerPhone}`} className="text-primary hover:underline">
                  {booking.customerPhone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Armchair className="h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.pax} pax • Kursi {booking.seats.join(", ")}
                </span>
              </div>
            </div>
          </section>

          {/* Trip info */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Perjalanan
            </h3>
            <div className="rounded-lg border bg-card p-3 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{booking.rayonName}</div>
                  <div className="text-muted-foreground text-xs">{booking.pickup}</div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{dateLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.time}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kendaraan</span>
                <span className="font-medium">{booking.vehicleLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{booking.serviceLabel}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Total</span>
                <span className="text-accent">Rp{booking.totalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </section>

          {/* Seat map */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Denah Kursi
            </h3>
            <div className="rounded-lg border bg-card p-3">
              <SeatMap
                vehicle={booking.vehicleId}
                totalSeats={totalSeats}
                occupied={occupied}
                selected={selected}
                maxSelect={booking.pax}
                onToggle={() => {}}
                tier={booking.serviceTier as ServiceTier}
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                Kursi yang dipesan ditandai (read-only).
              </p>
            </div>
          </section>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground text-center print:mt-6">
            Dibuat: {format(parseISO(booking.createdAt), "d MMM yyyy HH:mm", { locale: localeId })}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-2 print:hidden">
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="h-4 w-4" /> Cetak E-Ticket
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
