import { CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DashboardFooterProps {
  credits: number;
}

export const DashboardFooter = ({ credits }: DashboardFooterProps) => {
  return (
    <footer className="sticky bottom-0 bg-white/80 backdrop-blur-md shadow-sm mt-8 z-50">
      <div className="container mx-auto px-4 py-4 text-center text-gray-600">
        <p>Available Credits: {credits}</p>
        <Button variant="link" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Refill Credits <CreditCard className="inline w-4 h-4 ml-1" />
        </Button>
      </div>
    </footer>
  );
};