import { motion, AnimatePresence } from 'framer-motion';
import { MealPlanCard } from './MealPlanCard';
import type { MealPlan } from '@/types/user';

interface MealPlanListProps {
  plans: MealPlan[];
  onToggleMinimize: (id: string) => void;
  onClose: (id: string) => void;
  onSave: (id: string) => void;
  onRegenerate: (id: string) => void;
}

export const MealPlanList = ({
  plans,
  onToggleMinimize,
  onClose,
  onSave,
  onRegenerate
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
        />
      ))}
    </AnimatePresence>
  );
};