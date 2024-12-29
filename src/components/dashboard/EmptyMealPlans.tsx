import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface EmptyMealPlansProps {
  message: string;
  actionLabel: string;
}

export const EmptyMealPlans = ({ message, actionLabel }: EmptyMealPlansProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">{message}</p>
      <Button
        variant="outline"
        onClick={() => navigate('/dashboard')}
        className="bg-gradient-to-r from-emerald-600 to-emerald-400 text-white hover:from-emerald-700 hover:to-emerald-500"
      >
        {actionLabel}
      </Button>
    </div>
  );
};