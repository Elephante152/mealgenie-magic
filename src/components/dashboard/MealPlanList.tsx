import { AnimatePresence } from 'framer-motion';
import { MealPlanCard } from './MealPlanCard';
import type { MealPlan } from '@/types/user';

interface MealPlanListProps {
  plans: MealPlan[];
  onToggleMinimize: (id: string) => void;
  onClose: (id: string) => void;
  onSave: (id: string) => void;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MealPlanList = ({
  plans,
  onToggleMinimize,
  onClose,
  onSave,
  onRegenerate,
  onDelete
}: MealPlanListProps) => {
  return (
    <AnimatePresence>
      {plans.map((plan) => (
        <MealPlanCard
          key={plan.id}
          plan={plan}
          onToggleMinimize={onToggleMinimize}
          onClose={onClose}
          onSave={onSave}
          onRegenerate={onRegenerate}
          onDelete={onDelete}
        />
      ))}
    </AnimatePresence>
  );
};