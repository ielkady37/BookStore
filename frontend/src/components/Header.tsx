import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, BookOpen, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold hidden sm:inline">
            Bibliomania
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/">
            <Button variant={isActive("/") ? "secondary" : "ghost"} size="sm">
              Browse
            </Button>
          </Link>

          {/* Only show 'My Account' if logged in */}
          {isAuthenticated && (
            <Link to="/profile">
              <Button
                variant={isActive("/profile") ? "secondary" : "ghost"}
                size="sm"
              >
                My Account
              </Button>
            </Link>
          )}

          {/* Only show 'Admin' if user is Admin */}
          {isAdmin && (
            <Link to="/admin">
              <Button
                variant={isActive("/admin") ? "secondary" : "ghost"}
                size="sm"
              >
                Admin Dashboard
              </Button>
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground animate-scale-in">
                {itemCount}
              </span>
            )}
          </Button>

          {/* User Status Icons (Desktop) */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Hi, {user?.first_name || user?.fname || user?.username}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Browse
                  </Button>
                </Link>

                {isAuthenticated && (
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      My Account
                    </Button>
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}

                <div className="border-t pt-4 mt-2">
                  {isAuthenticated ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="default" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
