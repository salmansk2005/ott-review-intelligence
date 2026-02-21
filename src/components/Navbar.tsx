import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Heart, LayoutDashboard, Settings, LogOut, Film, BarChart3 } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/review-analysis", label: "Analytics", icon: BarChart3 },
    { to: "/favorites", label: "Favorites", icon: Heart },
    { to: "/preferences", label: "Preferences", icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-primary font-bold text-lg">
          <Film className="w-6 h-6" />
          <span className="hidden sm:inline">OTT Review Intelligence</span>
          <span className="sm:hidden">OTT RI</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                location.pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          
          {user && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <span className="text-xs text-muted-foreground hidden md:inline">{user.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
