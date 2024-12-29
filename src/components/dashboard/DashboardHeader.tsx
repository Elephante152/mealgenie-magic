import { Menu } from 'lucide-react';
import { AnimatedGradientText } from '@/components/landing/AnimatedGradientText';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
}

export const DashboardHeader = ({ isNavOpen, setIsNavOpen }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <AnimatedGradientText text="MealPrepGenie" className="text-2xl font-bold" />
        </div>
        <button 
          onClick={() => setIsNavOpen(true)} 
          className="text-gray-500 hover:text-gray-700"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/90 backdrop-blur-md">
          <SheetHeader>
            <SheetTitle>
              <AnimatedGradientText text="Navigation" className="text-2xl font-semibold" />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    navigate('/dashboard');
                    setIsNavOpen(false);
                  }}
                >
                  Dashboard
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    navigate('/meal-plans');
                    setIsNavOpen(false);
                  }}
                >
                  Meal Plans
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    navigate('/profile');
                    setIsNavOpen(false);
                  }}
                >
                  Profile
                </Button>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};