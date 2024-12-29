import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MealPlanCard } from './MealPlanCard';
import { MealPlanPreviewCard } from './MealPlanPreviewCard';
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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <MealPlanPreviewCard
            key={plan.id}
            plan={plan}
            onClick={() => setSelectedPlan(plan.id)}
          />
        ))}
      </div>
      <AnimatePresence>
        {selectedPlan && (
          <MealPlanCard
            plan={plans.find(p => p.id === selectedPlan)!}
            onToggleMinimize={onToggleMinimize}
            onClose={() => setSelectedPlan(null)}
            onSave={onSave}
            onRegenerate={onRegenerate}
            onDelete={onDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};