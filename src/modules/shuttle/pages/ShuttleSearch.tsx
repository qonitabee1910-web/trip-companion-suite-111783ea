import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ResponsiveLayout } from "@/shared/components/ResponsiveLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { SHUTTLES } from "../data/shuttles";

const ShuttleSearch = () => {
  const [params] = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const [timeFilter, setTimeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return SHUTTLES.filter((s) => {
      if (from && s.from !== from) return false;
      if (to && s.to !== to) return false;
      if (timeFilter !== "all") {
        const hour = parseInt(s.departTime.split(":")[0]);
        if (timeFilter === "morning" && (hour < 5 || hour >= 12)) return false;
        if (timeFilter === "afternoon" && (hour < 12 || hour >= 18)) return false;
        if (timeFilter === "evening" && hour < 18) return false;
      }
      return true;
    });
  }, [from, to, timeFilter]);

  return (
    <ResponsiveLayout
      mobileTitle={`${from} → ${to}`}
      mobileSubtitle={`${filtered.length} jadwal tersedia`}
      mobileBack="/shuttle"
    >
      <div className="container px-3 md:px-6 py-4 md:py-6 max-w-4xl">
        {/* Time filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
          {[
            { id: "all", label: "Semua Jam" },
            { id: "morning", label: "Pagi (05-12)" },
            { id: "afternoon", label: "Siang (12-18)" },
            { id: "evening", label: "Malam (18+)" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeFilter(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm border transition-colors ${
                timeFilter === t.id ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">Tidak ada jadwal yang sesuai.</Card>
          ) : (
            filtered.map((s) => (
              <Card key={s.id} className="p-4 shadow-card">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-shuttle-soft text-shuttle flex items-center justify-center font-bold">
                      {s.operator.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold">{s.operator}</p>
                      <p className="text-xs text-muted-foreground">{s.vehicle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold">{s.departTime}</p>
                      <p className="text-xs text-muted-foreground">{s.from}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.floor(s.durationMin / 60)}j {s.durationMin % 60}m
                      </p>
                      <div className="w-16 h-px bg-border my-1" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{s.arriveTime}</p>
                      <p className="text-xs text-muted-foreground">{s.to}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div>
                    <p className="text-xs text-warning font-medium">Sisa {s.seatsAvailable} kursi</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-accent">Rp{s.price.toLocaleString("id-ID")}</p>
                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link to={`/shuttle/${s.id}/book?${params.toString()}`}>Pilih</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default ShuttleSearch;
