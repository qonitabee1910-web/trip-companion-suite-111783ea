import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  icon: LucideIcon;
  label: string;
  path: string;
  color: "hotel" | "shuttle" | "ride" | "primary" | "accent";
  compact?: boolean;
}

const colorMap = {
  hotel: "bg-hotel-soft text-hotel",
  shuttle: "bg-shuttle-soft text-shuttle",
  ride: "bg-ride-soft text-ride",
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
};

export const ModuleCard = ({ icon: Icon, label, path, color, compact }: ModuleCardProps) => {
  return (
    <Link
      to={path}
      className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-0.5"
    >
      <div
        className={`flex items-center justify-center rounded-2xl ${colorMap[color]} ${
          compact ? "h-14 w-14" : "h-16 w-16 md:h-20 md:w-20"
        } shadow-card group-hover:shadow-elevated transition-shadow`}
      >
        <Icon className={compact ? "h-7 w-7" : "h-8 w-8 md:h-9 md:w-9"} strokeWidth={2} />
      </div>
      <span className={`font-medium text-foreground ${compact ? "text-xs" : "text-sm"}`}>{label}</span>
    </Link>
  );
};
