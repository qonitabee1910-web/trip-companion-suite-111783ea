import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRightLeft, MapPin, CalendarIcon, Users, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SHUTTLE_CITIES } from "../data/shuttles";

export const ShuttleSearchForm = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [from, setFrom] = useState("Jakarta");
  const [to, setTo] = useState("Bandung");
  const [date, setDate] = useState<Date>(new Date());
  const [pax, setPax] = useState(1);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const submit = () => {
    const params = new URLSearchParams({ from, to, date: date.toISOString(), pax: String(pax) });
    navigate(`/shuttle/search?${params.toString()}`);
  };

  const CityInput = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={value} readOnly className="pl-9 h-12 cursor-pointer" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        {SHUTTLE_CITIES.map((c) => (
          <button key={c} onClick={() => onChange(c)} className="w-full text-left px-2 py-2 text-sm rounded hover:bg-muted">
            {c}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );

  return (
    <Card className="p-4 md:p-5 shadow-elevated">
      <div className={cn("grid gap-3 items-end", isMobile ? "grid-cols-1" : "grid-cols-12")}>
        <div className={cn(isMobile ? "" : "col-span-3")}>
          <CityInput value={from} onChange={setFrom} label="Dari" />
        </div>

        <div className={cn(isMobile ? "flex justify-center -my-1" : "col-span-1 flex justify-center pb-1")}>
          <Button size="icon" variant="outline" onClick={swap} className="rounded-full h-10 w-10">
            <ArrowRightLeft className={isMobile ? "h-4 w-4 rotate-90" : "h-4 w-4"} />
          </Button>
        </div>

        <div className={cn(isMobile ? "" : "col-span-3")}>
          <CityInput value={to} onChange={setTo} label="Ke" />
        </div>

        <div className={cn(isMobile ? "" : "col-span-2")}>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Tanggal</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-12 justify-start font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "dd MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>

        <div className={cn(isMobile ? "" : "col-span-3")}>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Penumpang</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-12 justify-start font-normal">
                <Users className="mr-2 h-4 w-4" />
                {pax} penumpang
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="flex items-center justify-between">
                <span className="text-sm">Penumpang</span>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setPax(Math.max(1, pax - 1))}>-</Button>
                  <span className="w-6 text-center font-medium">{pax}</span>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setPax(Math.min(8, pax + 1))}>+</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={submit} className="w-full md:w-auto md:px-10 mt-4 h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground md:float-right">
        <Search className="mr-2 h-4 w-4" />
        Cari Shuttle
      </Button>
      <div className="clear-both" />
    </Card>
  );
};
