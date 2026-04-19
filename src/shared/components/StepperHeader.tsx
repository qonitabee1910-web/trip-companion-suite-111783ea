import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepKey = "rayon" | "schedule" | "service" | "vehicle" | "seat";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "rayon", label: "Rayon" },
  { key: "schedule", label: "Jadwal" },
  { key: "service", label: "Service" },
  { key: "vehicle", label: "Kendaraan" },
  { key: "seat", label: "Kursi" },
];

interface StepperHeaderProps {
  current: StepKey;
  className?: string;
}

export function StepperHeader({ current, className }: StepperHeaderProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <ol className="flex items-center gap-1 md:gap-2 min-w-max px-3 md:px-0 py-2">
        {STEPS.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li key={step.key} className="flex items-center gap-1 md:gap-2">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] md:text-xs font-medium transition-colors",
                  active && "bg-primary text-primary-foreground",
                  done && "bg-success/15 text-success",
                  !active && !done && "bg-muted text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold",
                    active && "bg-primary-foreground/25",
                    done && "bg-success/25",
                    !active && !done && "bg-background/50",
                  )}
                >
                  {done ? <Check className="h-2.5 w-2.5" /> : i + 1}
                </span>
                <span>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <span className={cn("h-px w-3 md:w-5", done ? "bg-success/40" : "bg-border")} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
