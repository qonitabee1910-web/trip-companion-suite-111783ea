import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Eye, Shield } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/20">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b bg-background px-3 md:px-4 sticky top-0 z-30">
            <SidebarTrigger />
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground leading-none">Admin Panel</p>
                <h1 className="font-semibold text-sm truncate">{title ?? "Shuttle Management"}</h1>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/shuttle">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Lihat sebagai user</span>
                </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-3 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
