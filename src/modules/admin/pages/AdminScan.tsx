import { useState, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { AdminLayout } from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CameraOff, ScanLine, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Keyboard, Camera } from "lucide-react";
import { getBookings, updateBookingStatus } from "@/modules/shuttle/data/repository";
import type { ShuttleBooking } from "@/modules/shuttle/types/booking";

type Phase = "scanning" | "found" | "not-found";

export default function AdminScan() {
  const [phase, setPhase] = useState<Phase>("scanning");
  const [booking, setBooking] = useState<ShuttleBooking | null>(null);
  const [notFoundId, setNotFoundId] = useState<string>("");
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const lastScanRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);

  const handleResult = (text: string) => {
    const now = Date.now();
    // debounce repeated scans
    if (text === lastScanRef.current && now - lastScanTimeRef.current < 2000) return;
    lastScanRef.current = text;
    lastScanTimeRef.current = now;
    lookup(text.trim());
  };

  const lookup = (id: string) => {
    if (!id) return;
    const found = getBookings().find((b) => b.id === id);
    if (!found) {
      setNotFoundId(id);
      setBooking(null);
      setPhase("not-found");
      return;
    }
    setBooking(found);
    setPhase("found");
  };

  const handleConfirm = () => {
    if (!booking) return;
    updateBookingStatus(booking.id, "done");
    toast.success(`Tiket ${booking.id} divalidasi`, {
      description: `${booking.customerName} • Kursi ${booking.seats.join(", ")}`,
    });
    setBooking({ ...booking, status: "done" });
    setTimeout(() => {
      reset();
    }, 1800);
  };

  const reset = () => {
    setBooking(null);
    setNotFoundId("");
    setManualInput("");
    lastScanRef.current = "";
    lastScanTimeRef.current = 0;
    setPhase("scanning");
  };

  return (
    <AdminLayout title="Scan Tiket">
      <div className="max-w-md mx-auto space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-primary" />
                Validasi Tiket
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setManualMode((m) => !m);
                  setCameraError(null);
                }}
              >
                {manualMode ? <Camera className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
                <span className="ml-1 hidden sm:inline">{manualMode ? "Kamera" : "Manual"}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {phase === "scanning" && (
              <>
                {!manualMode ? (
                  <div className="space-y-3">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                      {cameraError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                          <CameraOff className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{cameraError}</p>
                          <Button size="sm" variant="outline" onClick={() => setManualMode(true)}>
                            Mode Manual
                          </Button>
                        </div>
                      ) : (
                        <Scanner
                          onScan={(codes) => {
                            if (codes && codes.length > 0) handleResult(codes[0].rawValue);
                          }}
                          onError={(err) => {
                            const msg = err instanceof Error ? err.message : "Kamera tidak tersedia";
                            setCameraError(msg);
                          }}
                          constraints={{ facingMode }}
                          components={{ finder: true }}
                          styles={{
                            container: { width: "100%", height: "100%" },
                            video: { width: "100%", height: "100%", objectFit: "cover" },
                          }}
                        />
                      )}
                    </div>
                    {!cameraError && (
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">Arahkan ke QR di e-ticket</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setFacingMode((m) => (m === "environment" ? "user" : "environment"))
                          }
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="ml-1">Ganti Kamera</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      lookup(manualInput.trim());
                    }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium">Booking ID</label>
                    <div className="flex gap-2">
                      <Input
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="TRV-S1234567"
                        autoFocus
                      />
                      <Button type="submit">Cek</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Masukkan ID booking secara manual jika kamera tidak tersedia.
                    </p>
                  </form>
                )}
              </>
            )}

            {phase === "found" && booking && <BookingResult booking={booking} onConfirm={handleConfirm} onReset={reset} />}

            {phase === "not-found" && (
              <div className="space-y-3">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Tiket tidak ditemukan</AlertTitle>
                  <AlertDescription className="break-all">
                    ID: <span className="font-mono">{notFoundId}</span>
                  </AlertDescription>
                </Alert>
                <Button className="w-full" onClick={reset}>
                  <ScanLine className="h-4 w-4" /> Scan Lagi
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function BookingResult({
  booking,
  onConfirm,
  onReset,
}: {
  booking: ShuttleBooking;
  onConfirm: () => void;
  onReset: () => void;
}) {
  const isDone = booking.status === "done";
  const isCancelled = booking.status === "cancelled";

  return (
    <div className="space-y-3">
      {isCancelled ? (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Booking dibatalkan</AlertTitle>
          <AlertDescription>Tiket ini tidak valid.</AlertDescription>
        </Alert>
      ) : isDone ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Sudah pernah divalidasi</AlertTitle>
          <AlertDescription>Tiket ini sudah ditandai selesai sebelumnya.</AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-primary/50 bg-primary/5">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertTitle>Tiket valid</AlertTitle>
          <AlertDescription>Konfirmasi untuk menandai sebagai selesai.</AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border p-3 space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Booking ID</span>
          <span className="font-mono font-semibold">{booking.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Penumpang</span>
          <span className="font-medium">{booking.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rayon</span>
          <span>{booking.rayonName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Jadwal</span>
          <span>{booking.date} • {booking.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Kendaraan</span>
          <span>{booking.vehicleLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Service</span>
          <span>{booking.serviceLabel}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Kursi</span>
          <div className="flex gap-1 flex-wrap justify-end">
            {booking.seats.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center pt-1 border-t">
          <span className="text-muted-foreground">Status</span>
          <Badge variant={isDone ? "default" : isCancelled ? "destructive" : "outline"}>
            {booking.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onReset}>
          <ScanLine className="h-4 w-4" /> Scan Lagi
        </Button>
        <Button onClick={onConfirm} disabled={isDone || isCancelled}>
          <CheckCircle2 className="h-4 w-4" /> Tandai Done
        </Button>
      </div>
    </div>
  );
}
