import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { POPULAR_CITIES } from "../data/hotels";
import { useIsMobile } from "@/hooks/use-mobile";

interface HotelSearchFormProps {
  defaultCity?: string;
  defaultCheckIn?: Date;
  defaultCheckOut?: Date;
  defaultGuests?: number;
  defaultRooms?: number;
}

export const HotelSearchForm = ({
  defaultCity = "",
  defaultCheckIn,
  defaultCheckOut,
  defaultGuests = 2,
  defaultRooms = 1,
}: HotelSearchFormProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [city, setCity] = useState(defaultCity);
  const [checkIn, setCheckIn] = useState<Date>(defaultCheckIn ?? new Date());
  const [checkOut, setCheckOut] = useState<Date>(defaultCheckOut ?? new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(defaultGuests);
  const [rooms, setRooms] = useState(defaultRooms);
  const [showCities, setShowCities] = useState(false);

  const submit = () => {
    const params = new URLSearchParams({
      city,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests: String(guests),
      rooms: String(rooms),
    });
    navigate(`/hotel/search?${params.toString()}`);
  };

  return (
    <Card className="p-4 md:p-5 shadow-elevated">
      <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-12")}>
        {/* City */}
        <div className={cn(isMobile ? "" : "col-span-4")}>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Kota / Hotel</label>
          <Popover open={showCities} onOpenChange={setShowCities}>
            <PopoverTrigger asChild>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={() => setShowCities(true)}
                  placeholder="Bali, Yogyakarta..."
                  className="pl-9 h-12"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-2" align="start">
              <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Kota Populer</p>
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  className="w-full text-left px-2 py-2 text-sm rounded hover:bg-muted"
                  onClick={() => {
                    setCity(c);
                    setShowCities(false);
                  }}
                >
                  {c}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-in */}
        <div className={cn(isMobile ? "" : "col-span-3")}>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Check-in</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-12 justify-start font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(checkIn, "dd MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={checkIn} onSelect={(d) => d && setCheckIn(d)} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div className={cn(isMobile ? "" : "col-span-3")}>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Check-out</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-12 justify-start font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(checkOut, "dd MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={checkOut} onSelect={(d) => d && setCheckOut(d)} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className={cn(isMobile ? "" : "col-span-2")}>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Tamu & Kamar</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-12 justify-start font-normal">
                <Users className="mr-2 h-4 w-4" />
                {guests} tamu, {rooms} kamar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tamu</span>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGuests(Math.max(1, guests - 1))}>-</Button>
                    <span className="w-6 text-center font-medium">{guests}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGuests(guests + 1)}>+</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Kamar</span>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setRooms(Math.max(1, rooms - 1))}>-</Button>
                    <span className="w-6 text-center font-medium">{rooms}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setRooms(rooms + 1)}>+</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={submit} className="w-full md:w-auto md:px-10 mt-4 h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground md:float-right">
        <Search className="mr-2 h-4 w-4" />
        Cari Hotel
      </Button>
      <div className="clear-both" />
    </Card>
  );
};
