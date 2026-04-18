import { useNavigate, useSearchParams } from "react-router-dom";
import { ResponsiveLayout } from "@/shared/components/ResponsiveLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, Crown, Gauge } from "lucide-react";
import { SERVICES, VEHICLE_TYPES, calcPrice } from "../data/services";
import { getRayon, DESTINATION } from "../data/rayons";

const tierIcon = {
  reguler: Gauge,
  "semi-executive": Sparkles,
  executive: Crown,
} as const;

const ShuttleService = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const rayon = getRayon(params.get("rayon") || "A");

  const cheapestVehicle = VEHICLE_TYPES.reduce((min, v) => (v.basePrice < min.basePrice ? v : min), VEHICLE_TYPES[0]);

  const handlePick = (tier: string) => {
    const next = new URLSearchParams(params);
    next.set("service", tier);
    navigate(`/shuttle/vehicle?${next.toString()}`);
  };

  return (
    <ResponsiveLayout
      mobileTitle="Pilih Service"
      mobileBack={`/shuttle/rayon/${rayon?.id || "A"}`}
      mobileSubtitle={`${rayon?.name} → ${DESTINATION.short}`}
      hideBottomNav
      mobileHeaderVariant="plain"
    >
      <div className="container max-w-2xl py-4 md:py-8 px-3 md:px-6 space-y-3">
        <p className="text-sm text-muted-foreground px-1">
          Pilih kelas layanan sesuai kebutuhan perjalananmu ke {DESTINATION.short}.
        </p>

        {SERVICES.map((s) => {
          const Icon = tierIcon[s.tier];
          const startPrice = calcPrice(cheapestVehicle, s);
          const isExec = s.tier === "executive";
          return (
            <Card
              key={s.tier}
              className={`p-4 md:p-5 transition-all hover:shadow-card ${isExec ? "border-accent/40 bg-gradient-to-br from-accent/5 to-transparent" : ""}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      isExec ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{s.label}</h3>
                      {isExec && <Badge className="bg-accent text-accent-foreground">Premium</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-muted-foreground">mulai</p>
                  <p className="font-bold text-accent">Rp{startPrice.toLocaleString("id-ID")}</p>
                </div>
              </div>

              <ul className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs text-muted-foreground mb-4">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                    <span className="truncate">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePick(s.tier)}
                className={`w-full ${isExec ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}`}
                variant={isExec ? "default" : "outline"}
              >
                Pilih {s.label}
              </Button>
            </Card>
          );
        })}
      </div>
    </ResponsiveLayout>
  );
};

export default ShuttleService;
