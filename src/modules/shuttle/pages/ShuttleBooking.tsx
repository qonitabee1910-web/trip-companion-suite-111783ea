import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ResponsiveLayout } from "@/shared/components/ResponsiveLayout";
import { SHUTTLES } from "../data/shuttles";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, User } from "lucide-react";

const ShuttleBooking = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const shuttle = SHUTTLES.find((s) => s.id === id);
  const pax = Number(params.get("pax") || 1);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [pickup, setPickup] = useState(shuttle?.pickupPoints[0] || "");
  const [dropoff, setDropoff] = useState(shuttle?.dropoffPoints[0] || "");
  const [step, setStep] = useState<"seat" | "form" | "success">("seat");
  const [form, setForm] = useState({ name: "", phone: "" });

  if (!shuttle) return null;

  // Generate seat map (rows of 4: 2-aisle-2)
  const totalSeats = shuttle.totalSeats;
  const occupiedSeats = new Set(
    Array.from({ length: totalSeats - shuttle.seatsAvailable }, (_, i) => (i * 7) % totalSeats + 1),
  );

  const toggleSeat = (n: number) => {
    if (occupiedSeats.has(n)) return;
    setSelectedSeats((prev) =>
      prev.includes(n) ? prev.filter((s) => s !== n) : prev.length < pax ? [...prev, n] : prev,
    );
  };

  const total = shuttle.price * pax;

  if (step === "success") {
    return (
      <ResponsiveLayout mobileTitle="E-Ticket" mobileBack="/" hideBottomNav mobileHeaderVariant="plain">
        <div className="container max-w-lg py-10 px-4">
          <Card className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Tiket Dikonfirmasi!</h1>
            <p className="text-muted-foreground mb-6 font-mono font-bold">TRV-S{Date.now().toString().slice(-7)}</p>
            <div className="text-left bg-muted/50 rounded-lg p-4 space-y-2 mb-6 text-sm">
              <div className="flex justify-between"><span>Operator</span><span className="font-medium">{shuttle.operator}</span></div>
              <div className="flex justify-between"><span>Rute</span><span className="font-medium">{shuttle.from} → {shuttle.to}</span></div>
              <div className="flex justify-between"><span>Berangkat</span><span className="font-medium">{shuttle.departTime}</span></div>
              <div className="flex justify-between"><span>Kursi</span><span className="font-medium">{selectedSeats.join(", ")}</span></div>
              <div className="flex justify-between"><span>Jemput</span><span className="font-medium">{pickup}</span></div>
              <div className="flex justify-between"><span>Antar</span><span className="font-medium">{dropoff}</span></div>
              <div className="flex justify-between pt-2 border-t font-bold"><span>Total</span><span className="text-accent">Rp{total.toLocaleString("id-ID")}</span></div>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">Kembali ke Beranda</Button>
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  if (step === "form") {
    return (
      <ResponsiveLayout mobileTitle="Data Penumpang" mobileBack="#" hideBottomNav mobileHeaderVariant="plain">
        <div className="container max-w-2xl py-4 md:py-8 px-3 md:px-6">
          <Card className="p-4 md:p-6 space-y-4">
            <h2 className="font-semibold text-lg">Data Penumpang Utama</h2>
            <div>
              <Label>Nama Lengkap</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>No. Telepon</Label>
              <Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
            </div>
            <Button
              onClick={() => form.name && form.phone && setStep("success")}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 font-semibold"
            >
              Bayar Rp{total.toLocaleString("id-ID")}
            </Button>
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout mobileTitle="Pilih Kursi" mobileBack={`/shuttle/search?${params.toString()}`} hideBottomNav mobileHeaderVariant="plain">
      <div className="container max-w-3xl py-4 md:py-8 px-3 md:px-6 grid md:grid-cols-[1fr_300px] gap-4">
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Pilih Kursi ({selectedSeats.length}/{pax})</h2>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-xs text-center text-muted-foreground mb-3">Depan (Sopir)</div>
              <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                {Array.from({ length: totalSeats }).map((_, i) => {
                  const num = i + 1;
                  const isOccupied = occupiedSeats.has(num);
                  const isSelected = selectedSeats.includes(num);
                  // insert aisle gap at column 3
                  const col = i % 4;
                  return (
                    <button
                      key={num}
                      onClick={() => toggleSeat(num)}
                      disabled={isOccupied}
                      className={`aspect-square rounded text-xs font-medium border-2 transition-colors ${
                        col === 2 ? "col-start-4" : ""
                      } ${
                        isOccupied
                          ? "bg-muted text-muted-foreground border-muted cursor-not-allowed"
                          : isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-primary/30 hover:border-primary"
                      }`}
                      style={col === 2 ? { gridColumnStart: 4 } : undefined}
                    >
                      {isOccupied ? <User className="h-3 w-3 mx-auto" /> : num}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded border-2 border-primary/30 bg-card" />Tersedia</div>
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-primary" />Dipilih</div>
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-muted" />Terisi</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h2 className="font-semibold">Titik Jemput & Antar</h2>
            <div>
              <Label className="text-xs">Titik Jemput ({shuttle.from})</Label>
              <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm">
                {shuttle.pickupPoints.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Titik Antar ({shuttle.to})</Label>
              <select value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm">
                {shuttle.dropoffPoints.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </Card>
        </div>

        <Card className="p-4 h-fit md:sticky md:top-4">
          <h3 className="font-semibold mb-3">Ringkasan</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Operator</span><span className="font-medium">{shuttle.operator}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Rute</span><span className="font-medium">{shuttle.from}→{shuttle.to}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Berangkat</span><span className="font-medium">{shuttle.departTime}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Penumpang</span><span className="font-medium">{pax}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Kursi</span><span className="font-medium">{selectedSeats.join(", ") || "-"}</span></div>
            <div className="flex justify-between pt-2 border-t mt-2 font-bold"><span>Total</span><span className="text-accent">Rp{total.toLocaleString("id-ID")}</span></div>
          </div>
          <Button
            disabled={selectedSeats.length !== pax}
            onClick={() => setStep("form")}
            className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground h-12 font-semibold"
          >
            Lanjut
          </Button>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default ShuttleBooking;
