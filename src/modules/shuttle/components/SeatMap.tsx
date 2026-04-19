import { User } from "lucide-react";
import { getSeatLayout, type ServiceTier } from "../data/seatLayouts";

interface SeatMapProps {
  vehicle: string;
  totalSeats: number;
  occupied: Set<number>;
  selected: number[];
  maxSelect: number;
  onToggle: (n: number) => void;
  tier?: ServiceTier;
}

export function SeatMap({ vehicle, totalSeats, occupied, selected, maxSelect, onToggle, tier }: SeatMapProps) {
  const layout = getSeatLayout(vehicle, totalSeats, tier);

  return (
    <div className="space-y-3">
      <div
        className="relative mx-auto w-full max-w-[260px] rounded-xl bg-muted/30 p-2"
        style={{ aspectRatio: layout.aspect }}
      >
        {/* Vehicle base image */}
        <img
          src={layout.image}
          alt={`Denah ${vehicle}`}
          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
          draggable={false}
        />

        {/* Driver seat (steering wheel) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-warning/20 border-2 border-warning text-warning"
          style={{
            left: `${layout.driverSeat.x}%`,
            top: `${layout.driverSeat.y}%`,
            width: "11%",
            aspectRatio: "1",
          }}
          title="Sopir"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-1/2 w-1/2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="2" />
            <path d="M12 14v7M5 12h4M15 12h4" />
          </svg>
        </div>

        {/* Passenger seats */}
        {layout.seats.map((seat) => {
          const isOccupied = occupied.has(seat.num);
          const isSelected = selected.includes(seat.num);
          const disabled = isOccupied || (!isSelected && selected.length >= maxSelect);
          return (
            <button
              key={seat.num}
              type="button"
              onClick={() => onToggle(seat.num)}
              disabled={isOccupied}
              aria-label={`Kursi ${seat.num}${isOccupied ? " terisi" : isSelected ? " dipilih" : ""}`}
              aria-pressed={isSelected}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-md text-[10px] font-bold border-2 transition-all ${
                isOccupied
                  ? "bg-muted text-muted-foreground border-muted cursor-not-allowed"
                  : isSelected
                    ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md"
                    : disabled
                      ? "bg-card text-muted-foreground border-border cursor-not-allowed opacity-60"
                      : "bg-card text-foreground border-primary/40 hover:border-primary hover:bg-primary/10"
              }`}
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                width: "11%",
                aspectRatio: "1",
              }}
            >
              {isOccupied ? <User className="h-3 w-3" /> : seat.num}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-primary/40 bg-card" />
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-primary bg-primary" />
          <span>Dipilih</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-muted border-2 border-muted" />
          <span>Terisi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border-2 border-warning bg-warning/20" />
          <span>Sopir</span>
        </div>
      </div>
    </div>
  );
}
