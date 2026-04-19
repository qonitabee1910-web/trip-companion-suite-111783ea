import { LayoutDashboard, MapPin, Sparkles, Bus, Ticket, Armchair, ScanLine } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Rayon & Jam", url: "/admin/shuttle/rayons", icon: MapPin },
  { title: "Service", url: "/admin/shuttle/services", icon: Sparkles },
  { title: "Kendaraan", url: "/admin/shuttle/vehicles", icon: Bus },
  { title: "Booking", url: "/admin/shuttle/bookings", icon: Ticket },
  { title: "Scan Tiket", url: "/admin/shuttle/scan", icon: ScanLine },
  { title: "Seat Layout", url: "/admin/shuttle/seat-editor", icon: Armchair },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Shuttle Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}
