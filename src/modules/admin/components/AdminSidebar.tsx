import { LayoutDashboard, MapPin, Sparkles, Bus, Ticket, Armchair, ScanLine, Image, PackageOpen } from "lucide-react";
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

type Item = { title: string; url: string; icon: typeof MapPin; end?: boolean };

const groups: { label: string; items: Item[] }[] = [
  {
    label: "Konten & Branding",
    items: [{ title: "Beranda Shuttle", url: "/admin/shuttle/content", icon: Image }],
  },
  {
    label: "Setup Layanan",
    items: [
      { title: "Rayon & Jam", url: "/admin/shuttle/rayons", icon: MapPin },
      { title: "Service", url: "/admin/shuttle/services", icon: Sparkles },
      { title: "Kendaraan", url: "/admin/shuttle/vehicles", icon: Bus },
      { title: "Seat Layout", url: "/admin/shuttle/seat-editor", icon: Armchair },
    ],
  },
  {
    label: "Operasional",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
      { title: "Booking", url: "/admin/shuttle/bookings", icon: Ticket },
      { title: "Scan Tiket", url: "/admin/shuttle/scan", icon: ScanLine },
      { title: "Inventori Kursi", url: "/admin/shuttle/inventory", icon: PackageOpen },
    ],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
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
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
