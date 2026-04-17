import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ResponsiveLayout } from "@/shared/components/ResponsiveLayout";
import { HotelCard } from "../components/HotelCard";
import { HOTELS } from "../data/hotels";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ALL_AMENITIES = ["WiFi Gratis", "Sarapan", "Kolam Renang", "Parkir", "Spa", "Gym"];

const FilterPanel = ({
  priceRange,
  setPriceRange,
  selectedStars,
  setSelectedStars,
  selectedAmenities,
  setSelectedAmenities,
}: any) => (
  <div className="space-y-5">
    <div>
      <h3 className="font-semibold mb-3">Rentang Harga</h3>
      <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={3000000} step={100000} />
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>Rp{priceRange[0].toLocaleString("id-ID")}</span>
        <span>Rp{priceRange[1].toLocaleString("id-ID")}</span>
      </div>
    </div>
    <div>
      <h3 className="font-semibold mb-3">Bintang Hotel</h3>
      <div className="flex flex-wrap gap-2">
        {[5, 4, 3].map((s) => (
          <button
            key={s}
            onClick={() =>
              setSelectedStars((prev: number[]) => (prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]))
            }
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm ${
              selectedStars.includes(s) ? "border-primary bg-primary-soft text-primary" : "border-border"
            }`}
          >
            {s} <Star className="h-3 w-3 fill-current" />
          </button>
        ))}
      </div>
    </div>
    <div>
      <h3 className="font-semibold mb-3">Fasilitas</h3>
      <div className="space-y-2">
        {ALL_AMENITIES.map((a) => (
          <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={selectedAmenities.includes(a)}
              onCheckedChange={(checked) =>
                setSelectedAmenities((prev: string[]) => (checked ? [...prev, a] : prev.filter((v) => v !== a)))
              }
            />
            {a}
          </label>
        ))}
      </div>
    </div>
  </div>
);

const HotelSearch = () => {
  const [params] = useSearchParams();
  const city = params.get("city") || "";
  const isMobile = useIsMobile();
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return HOTELS.filter((h) => {
      if (city && !h.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (h.pricePerNight < priceRange[0] || h.pricePerNight > priceRange[1]) return false;
      if (selectedStars.length && !selectedStars.includes(h.stars)) return false;
      if (selectedAmenities.length && !selectedAmenities.every((a) => h.amenities.includes(a))) return false;
      return true;
    });
  }, [city, priceRange, selectedStars, selectedAmenities]);

  const filterProps = { priceRange, setPriceRange, selectedStars, setSelectedStars, selectedAmenities, setSelectedAmenities };

  return (
    <ResponsiveLayout
      mobileTitle={city || "Hotel"}
      mobileSubtitle={`${filtered.length} hotel ditemukan`}
      mobileBack="/hotel"
      mobileHeaderRight={
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterPanel {...filterProps} />
            </div>
          </SheetContent>
        </Sheet>
      }
    >
      <div className="container px-3 md:px-6 py-4 md:py-6">
        {!isMobile && (
          <h1 className="text-2xl font-bold mb-4">
            Hotel di {city || "Indonesia"} <span className="text-base font-normal text-muted-foreground">({filtered.length} hasil)</span>
          </h1>
        )}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-6">
          {!isMobile && (
            <Card className="p-4 h-fit sticky top-20">
              <FilterPanel {...filterProps} />
            </Card>
          )}
          <div className="space-y-3 md:space-y-4">
            {filtered.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">Tidak ada hotel yang sesuai filter.</Card>
            ) : (
              filtered.map((h) => <HotelCard key={h.id} hotel={h} searchQuery={params.toString()} />)
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default HotelSearch;
