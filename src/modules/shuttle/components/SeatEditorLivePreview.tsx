import { useState } from "react";
import { User, RotateCcw, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import type { SeatLayoutConfig } from "../data/seatLayouts";

interface Props {
  config: SeatLayoutConfig;
  /** Berapa kursi yang akan ditandai sebagai 'terisi' (mock). */
  occupiedCount?: number;
  /** Berapa kursi maksimal bisa dipilih dalam preview. */
  maxSelect?: number;
}

/**
 * Preview live SeatMap user-view yang membaca config in-memory editor
 * (tanpa perlu save ke storage).
 */
export function SeatEditorLivePreview({ config, occupiedCount = 2, maxSelect = 2 }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [mobileMode, setMobileMode] = useState(false);

  const seatSize = config.seatSize ?? 11;

  // Mock occupied: kursi pertama N
  const occupiedSet = new Set(
    config.seats.slice(0, Math.min(occupiedCount, config.seats.length)).map((s) => s.num),
  );

  const toggle = (n: number) => {
    setSelected((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= maxSelect) return prev;
      return [...prev, n];
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">Preview User View</h3>
          <p className="text-[10px] text-muted-foreground">
            Persis seperti tampilan pelanggan saat memilih kursi
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-[10px]">{config.seats.length} seats</Badge>
          <Toggle
            size="sm"
            pressed={mobileMode}
            onPressedChange={setMobileMode}
            aria-label="Toggle mode mobile"
            title={mobileMode ? "Mode desktop" : "Mode mobile (375px)"}
            className="h-7 w-7 p-0"
          >
            {mobileMode ? <Smartphone className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
          </Toggle>
          {selected.length > 0 && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setSelected([])}
              title="Reset pilihan"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {mobileMode ? (
        <div className="mx-auto w-[375px] max-w-full rounded-[2rem] border-8 border-foreground/80 bg-background shadow-xl overflow-hidden">
          <div className="h-5 bg-foreground/80 flex items-center justify-center">
            <div className="h-1 w-12 rounded-full bg-background/40" />
          </div>
          <div className="p-3 bg-background">
            <p className="text-[10px] text-muted-foreground text-center mb-2">375 × auto • iPhone-like</p>
            <div
              className="relative mx-auto w-full max-w-[260px] rounded-xl bg-muted/30 p-2"
              style={{ aspectRatio: config.aspect }}
            >
              <PreviewSeats config={config} seatSize={seatSize} occupiedSet={occupiedSet} selected={selected} maxSelect={maxSelect} onToggle={toggle} />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative mx-auto w-full max-w-[260px] rounded-xl bg-muted/30 p-2"
          style={{ aspectRatio: config.aspect }}
        >
          <PreviewSeats config={config} seatSize={seatSize} occupiedSet={occupiedSet} selected={selected} maxSelect={maxSelect} onToggle={toggle} />
        </div>
      )}

      {/* legend */}
      <Legend />
    </div>
  );
}

interface SeatsProps {
  config: SeatLayoutConfig;
  seatSize: number;
  occupiedSet: Set<number>;
  selected: number[];
  maxSelect: number;
  onToggle: (n: number) => void;
}

function PreviewSeats({ config, seatSize, occupiedSet, selected, maxSelect, onToggle }: SeatsProps) {
  return (
    <>
      <img
        src={config.image}
        alt="Denah preview"
        className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
        draggable={false}
        />

        {/* Driver */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-warning/20 border-2 border-warning text-warning"
          style={{
            left: `${config.driverSeat.x}%`,
            top: `${config.driverSeat.y}%`,
            width: `${seatSize}%`,
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
        {config.seats.map((seat) => {
          const isOccupied = occupiedSet.has(seat.num);
          const isSelected = selected.includes(seat.num);
          const disabled = isOccupied || (!isSelected && selected.length >= maxSelect);
          return (
            <button
              key={seat.num}
              type="button"
              onClick={() => toggle(seat.num)}
              disabled={isOccupied}
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
                width: `${seatSize}%`,
                aspectRatio: "1",
              }}
            >
              {isOccupied ? <User className="h-3 w-3" /> : seat.num}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded border-2 border-primary/40 bg-card" />
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded border-2 border-primary bg-primary" />
          <span>Dipilih</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-muted border-2 border-muted" />
          <span>Terisi (mock)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full border-2 border-warning bg-warning/20" />
          <span>Sopir</span>
        </div>
      </div>
    </div>
  );
}
