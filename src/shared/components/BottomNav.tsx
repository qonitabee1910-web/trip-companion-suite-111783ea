import { Link, useLocation } from "react-router-dom";
import { Home, Ticket, Tag, User } from "lucide-react";

export const BottomNav = () => {
  const { pathname } = useLocation();
  const items = [
    { icon: Home, label: "Beranda", path: "/" },
    { icon: Ticket, label: "Booking", path: "/booking" },
    { icon: Tag, label: "Promo", path: "/promo" },
    { icon: User, label: "Akun", path: "/account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "fill-primary/10" : ""}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
