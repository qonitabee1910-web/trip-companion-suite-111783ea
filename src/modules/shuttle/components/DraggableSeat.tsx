import { useRef } from "react";
import { Disc3, X } from "lucide-react";

interface DraggableSeatProps {
  x: number;
  y: number;
  label: string | number;
  selected?: boolean;
  isDriver?: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onMove: (x: number, y: number) => void;
  onSelect?: () => void;
  onDelete?: () => void;
  snap?: number; // percentage step e.g. 1
  size?: number; // percent of container width
}

export function DraggableSeat({
  x,
  y,
  label,
  selected,
  isDriver,
  containerRef,
  onMove,
  onSelect,
  onDelete,
  snap,
  size = 11,
}: DraggableSeatProps) {
  const dragging = useRef(false);
  const moved = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dragging.current = true;
    moved.current = false;
    (e.target as HTMLButtonElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let nx = ((e.clientX - rect.left) / rect.width) * 100;
    let ny = ((e.clientY - rect.top) / rect.height) * 100;
    nx = Math.max(0, Math.min(100, nx));
    ny = Math.max(0, Math.min(100, ny));
    if (snap && snap > 0) {
      nx = Math.round(nx / snap) * snap;
      ny = Math.round(ny / snap) * snap;
    }
    moved.current = true;
    onMove(Number(nx.toFixed(1)), Number(ny.toFixed(1)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragging.current = false;
    (e.target as HTMLButtonElement).releasePointerCapture(e.pointerId);
    if (!moved.current && onSelect) onSelect();
  };

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        aspectRatio: "1",
      }}
    >
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`flex h-full w-full items-center justify-center rounded-md text-[10px] font-bold border-2 touch-none cursor-move transition-shadow ${
          isDriver
            ? "bg-warning/20 border-warning text-warning rounded-full"
            : selected
              ? "bg-primary text-primary-foreground border-primary ring-2 ring-ring shadow-lg"
              : "bg-card text-foreground border-primary/40 hover:border-primary"
        }`}
      >
        {isDriver ? <Disc3 className="h-1/2 w-1/2" /> : label}
      </button>
      {onDelete && selected && !isDriver && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Hapus kursi"
          className="absolute -right-1.5 -top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:scale-110 transition-transform"
        >
          <X className="h-3 w-3" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
