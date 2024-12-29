import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MealPlanList } from './MealPlanList';
import { EmptyMealPlans } from './EmptyMealPlans';
import type { MealPlan } from '@/types/user';

interface MealPlanDisplayProps {
  plans: MealPlan[] | undefined;
  isLoading: boolean;
  onClose: (id: string) => void;
  onSave: (id: string) => void;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'saved' | 'favorited';
}

export const MealPlanDisplay = ({
  plans,
  isLoading,
  onClose,
  onSave,
  onRegenerate,
  onDelete,
  type
}: MealPlanDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === 'saved' ? 'Saved Meal Plans' : 'Favorited Plans'}</CardTitle>
        <CardDescription>
          {type === 'saved' 
            ? 'Access your previously generated and saved meal plans'
            : 'Quick access to your favorite meal plans'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            </div>
          ) : !plans || plans.length === 0 ? (
            <EmptyMealPlans
              message={type === 'saved' ? "No saved meal plans yet." : "No favorited meal plans yet."}
              actionLabel={type === 'saved' ? "Generate a New Plan" : "Explore Plans"}
            />
          ) : (
            <MealPlanList
              plans={plans}
              onToggleMinimize={() => {}}
              onClose={onClose}
              onSave={onSave}
              onRegenerate={onRegenerate}
              onDelete={onDelete}
            />
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};