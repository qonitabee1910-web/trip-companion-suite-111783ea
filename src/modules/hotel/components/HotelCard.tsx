import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Hotel } from "../types";

interface HotelCardProps {
  hotel: Hotel;
  searchQuery?: string;
}

export const HotelCard = ({ hotel, searchQuery = "" }: HotelCardProps) => {
  return (
    <Link to={`/hotel/${hotel.id}?${searchQuery}`}>
      <Card className="overflow-hidden shadow-card hover:shadow-elevated transition-shadow flex flex-col md:flex-row">
        <div className="md:w-64 aspect-[4/3] md:aspect-auto md:flex-shrink-0 bg-muted">
          <img src={hotel.images[0]} alt={hotel.name} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
            ))}
          </div>
          <h3 className="text-base md:text-lg font-bold leading-tight">{hotel.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{hotel.address}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="text-xs bg-muted px-2 py-0.5 rounded">
                {a}
              </span>
            ))}
          </div>
          <div className="mt-auto pt-3 flex items-end justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                {hotel.rating}
              </span>
              <span className="text-xs text-muted-foreground">{hotel.reviewCount} ulasan</span>
            </div>
            <div className="text-right">
              {hotel.originalPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  Rp{hotel.originalPrice.toLocaleString("id-ID")}
                </p>
              )}
              <p className="text-lg font-bold text-accent">Rp{hotel.pricePerNight.toLocaleString("id-ID")}</p>
              <p className="text-xs text-muted-foreground">/malam</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
