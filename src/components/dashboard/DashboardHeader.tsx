import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardHeaderProps {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
}

export const DashboardHeader = ({ isNavOpen, setIsNavOpen }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { name: "Meal Plans", icon: <Menu className="h-4 w-4" />, path: "/meal-plans" },
    { name: "Profile", icon: <User className="h-4 w-4" />, path: "/profile" },
  ];

  const NavLinks = () => (
    <div className="flex items-center gap-4">
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant={location.pathname === item.path ? "secondary" : "ghost"}
          size="sm"
          className="flex items-center gap-2"
          asChild
        >
          <Link to={item.path}>
            {item.icon}
            <span>{item.name}</span>
          </Link>
        </Button>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="hidden md:block">
            <NavLinks />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="block md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-base"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              "Logging out..."
            ) : (
              <>
                Logout
                <LogOut className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};