import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  BarChart3,
  BookOpen,
  ChevronLeft,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { to: "/admin", label: "Inventory", icon: Package, end: true },
  { to: "/admin/orders", label: "Publisher Orders", icon: Truck },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="font-display text-lg font-bold">Admin</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link key={item.to} to={item.to}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive(item.to, item.end) &&
                  "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Link to="/">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-11 text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "justify-center px-0"
            )}
          >
            <Home className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Back to Store</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
