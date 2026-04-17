import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ResponsiveLayout } from "@/shared/components/ResponsiveLayout";
import { HOTELS } from "../data/hotels";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Wifi, Coffee, Car as CarIcon, Waves, Dumbbell, Sparkles, Check } from "lucide-react";
import { MiniMap } from "@/shared/components/MiniMap";

const amenityIcons: Record<string, any> = {
  "WiFi Gratis": Wifi,
  Sarapan: Coffee,
  Parkir: CarIcon,
  "Kolam Renang": Waves,
  Gym: Dumbbell,
  Spa: Sparkles,
};

const HotelDetail = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hotel = HOTELS.find((h) => h.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!hotel) {
    return (
      <ResponsiveLayout mobileBack="/hotel" mobileTitle="Hotel tidak ditemukan">
        <div className="container py-12 text-center">Hotel tidak ditemukan.</div>
      </ResponsiveLayout>
    );
  }

  const handleBook = (roomId: string) => {
    const newParams = new URLSearchParams(params);
    newParams.set("roomId", roomId);
    navigate(`/hotel/${hotel.id}/book?${newParams.toString()}`);
  };

  return (
    <ResponsiveLayout mobileTitle={hotel.name} mobileBack={`/hotel/search?${params.toString()}`} mobileHeaderVariant="plain">
      <div className="container px-0 md:px-6 py-0 md:py-6 max-w-5xl">
        {/* Gallery */}
        <div className="md:rounded-lg overflow-hidden">
          <div className="aspect-[16/9] md:aspect-[21/9] bg-muted">
            <img src={hotel.images[selectedImage]} alt={hotel.name} className="h-full w-full object-cover" />
          </div>
          {hotel.images.length > 1 && (
            <div className="flex gap-2 p-3 bg-card overflow-x-auto scrollbar-hide">
              {hotel.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 h-16 w-24 rounded overflow-hidden border-2 ${
                    i === selectedImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-3 md:px-0 py-4 space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <h1 className="text-xl md:text-2xl font-bold">{hotel.name}</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              {hotel.address}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-primary text-primary-foreground text-sm font-bold px-2 py-1 rounded">
                {hotel.rating}
              </span>
              <span className="text-sm">Sangat Bagus</span>
              <span className="text-sm text-muted-foreground">· {hotel.reviewCount} ulasan</span>
            </div>
          </div>

          {/* Description */}
          <Card className="p-4">
            <h2 className="font-semibold mb-2">Tentang Hotel</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{hotel.description}</p>
          </Card>

          {/* Amenities */}
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Fasilitas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {hotel.amenities.map((a) => {
                const Icon = amenityIcons[a] || Check;
                return (
                  <div key={a} className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    {a}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Map */}
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Lokasi</h2>
            <MiniMap lat={hotel.lat} lng={hotel.lng} label={hotel.name} />
          </Card>

          {/* Rooms */}
          <div>
            <h2 className="font-semibold mb-3 px-1">Pilih Kamar</h2>
            <div className="space-y-3">
              {hotel.rooms.map((room) => (
                <Card key={room.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {room.bed} · Maks {room.capacity} tamu
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {room.breakfast && <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">✓ Sarapan</span>}
                      {room.refundable && <span className="text-xs bg-primary-soft text-primary px-2 py-0.5 rounded">Bisa Refund</span>}
                    </div>
                  </div>
                  <div className="md:text-right flex md:flex-col items-end justify-between md:justify-center gap-2">
                    <div>
                      <p className="text-lg font-bold text-accent">Rp{room.price.toLocaleString("id-ID")}</p>
                      <p className="text-xs text-muted-foreground">/malam</p>
                    </div>
                    <Button onClick={() => handleBook(room.id)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Pilih
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default HotelDetail;
