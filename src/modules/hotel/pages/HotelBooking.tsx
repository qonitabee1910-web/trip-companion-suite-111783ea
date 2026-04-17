import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ResponsiveLayout } from "@/shared/components/ResponsiveLayout";
import { HOTELS } from "../data/hotels";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { differenceInDays } from "date-fns";
import { CheckCircle2 } from "lucide-react";

const HotelBooking = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hotel = HOTELS.find((h) => h.id === id);
  const room = hotel?.rooms.find((r) => r.id === params.get("roomId")) || hotel?.rooms[0];
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  if (!hotel || !room) return null;

  const checkIn = params.get("checkIn") ? new Date(params.get("checkIn")!) : new Date();
  const checkOut = params.get("checkOut") ? new Date(params.get("checkOut")!) : new Date(Date.now() + 86400000);
  const nights = Math.max(1, differenceInDays(checkOut, checkIn));
  const total = room.price * nights;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (success) {
    return (
      <ResponsiveLayout mobileTitle="Pemesanan Berhasil" mobileBack="/" mobileHeaderVariant="plain" hideBottomNav>
        <div className="container max-w-lg py-10 px-4">
          <Card className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Pemesanan Berhasil!</h1>
            <p className="text-muted-foreground mb-6">
              Booking ID: <span className="font-mono font-bold">TRV-{Date.now().toString().slice(-8)}</span>
            </p>
            <div className="text-left bg-muted/50 rounded-lg p-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm"><span>Hotel</span><span className="font-medium">{hotel.name}</span></div>
              <div className="flex justify-between text-sm"><span>Kamar</span><span className="font-medium">{room.name}</span></div>
              <div className="flex justify-between text-sm"><span>Malam</span><span className="font-medium">{nights} malam</span></div>
              <div className="flex justify-between text-base pt-2 border-t"><span className="font-semibold">Total</span><span className="font-bold text-accent">Rp{total.toLocaleString("id-ID")}</span></div>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">Kembali ke Beranda</Button>
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout mobileTitle="Detail Pemesan" mobileBack={`/hotel/${hotel.id}`} mobileHeaderVariant="plain" hideBottomNav>
      <div className="container max-w-3xl py-4 md:py-8 px-3 md:px-6 grid md:grid-cols-[1fr_320px] gap-4">
        <form onSubmit={submit}>
          <Card className="p-4 md:p-6 space-y-4">
            <h2 className="font-semibold text-lg">Data Pemesan</h2>
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">No. Telepon</Label>
              <Input id="phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-semibold">
              Bayar Rp{total.toLocaleString("id-ID")}
            </Button>
          </Card>
        </form>

        <Card className="p-4 h-fit">
          <h3 className="font-semibold mb-3">Ringkasan</h3>
          <img src={hotel.images[0]} alt="" className="w-full aspect-video object-cover rounded mb-3" />
          <p className="font-semibold text-sm">{hotel.name}</p>
          <p className="text-xs text-muted-foreground mb-3">{room.name}</p>
          <div className="space-y-1.5 text-sm border-t pt-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Harga / malam</span><span>Rp{room.price.toLocaleString("id-ID")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Jumlah malam</span><span>{nights}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t mt-2"><span>Total</span><span className="text-accent">Rp{total.toLocaleString("id-ID")}</span></div>
          </div>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default HotelBooking;
