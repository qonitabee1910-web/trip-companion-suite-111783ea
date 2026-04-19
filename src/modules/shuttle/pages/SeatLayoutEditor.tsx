import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeatEditorPanel } from "../components/SeatEditorPanel";

export default function SeatLayoutEditor() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 p-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/shuttle"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Seat Layout Editor</h1>
            <p className="text-xs text-muted-foreground">Drag kursi di atas denah, lalu simpan atau export</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">
        <SeatEditorPanel />
      </main>
    </div>
  );
}
