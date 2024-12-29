import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from '@/components/landing/AnimatedGradientText';

export const MealPlansHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="hover:bg-gray-100"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold">
          <AnimatedGradientText text="Your Meal Plans" />
        </h1>
      </div>
    </div>
  );
};