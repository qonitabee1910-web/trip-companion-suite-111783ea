import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  back?: string;
  variant?: "primary" | "plain";
  right?: React.ReactNode;
}

export const MobileHeader = ({ title, subtitle, back, variant = "primary", right }: MobileHeaderProps) => {
  const isPrimary = variant === "primary";
  return (
    <header
      className={`sticky top-0 z-30 flex items-center gap-2 px-3 py-3 ${
        isPrimary ? "bg-gradient-hero text-primary-foreground" : "bg-card text-foreground border-b"
      }`}
    >
      {back && (
        <Button
          asChild
          variant="ghost"
          size="icon"
          className={isPrimary ? "text-primary-foreground hover:bg-white/15 hover:text-primary-foreground" : ""}
        >
          <Link to={back}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold truncate">{title}</h1>
        {subtitle && <p className={`text-xs truncate ${isPrimary ? "text-white/80" : "text-muted-foreground"}`}>{subtitle}</p>}
      </div>
      {right}
    </header>
  );
};
