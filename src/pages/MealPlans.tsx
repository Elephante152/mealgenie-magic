import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MealPlanDisplay } from '@/components/dashboard/MealPlanDisplay';
import { MealPlansHeader } from '@/components/dashboard/MealPlansHeader';
import type { MealPlan } from '@/types/user';
import type { Tables } from '@/integrations/supabase/types';

const MealPlans = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("saved");

  const { data: mealPlans, isLoading } = useQuery({
    queryKey: ['meal-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching meal plans",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return (data as Tables['meal_plans']['Row'][]).map((plan): MealPlan => {
        let parsedPlan;
        try {
          parsedPlan = typeof plan.recipes === 'string' ? JSON.parse(plan.recipes) : plan.recipes;
        } catch (e) {
          console.error('Error parsing plan:', e);
          parsedPlan = plan.recipes;
        }

        return {
          id: plan.id,
          title: plan.plan_name,
          plan: typeof parsedPlan === 'string' ? parsedPlan : JSON.stringify(parsedPlan, null, 2),
          isMinimized: false,
          isFavorited: plan.is_favorited || false,
          preferences: {
            diet: 'omnivore',
            cuisines: [],
            allergies: [],
            parameters: {
              mealsPerDay: 3,
              numDays: 7,
              caloricTarget: 2000
            }
          }
        };
      });
    },
  });

  const handleClose = (id: string) => {
    // Close functionality if needed
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('meal_plans')
      .update({ is_favorited: true })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating meal plan",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Meal plan updated",
        description: "The meal plan has been updated successfully.",
      });
    }
  };

  const handleRegenerate = (id: string) => {
    // Regeneration functionality if needed
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .match({ id });

    if (error) {
      toast({
        title: "Error deleting meal plan",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Meal plan deleted",
        description: "The meal plan has been deleted successfully.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <MealPlansHeader />
        <MealPlanDisplay
          plans={mealPlans}
          isLoading={isLoading}
          onClose={handleClose}
          onSave={handleSave}
          onRegenerate={handleRegenerate}
          onDelete={handleDelete}
          type="saved"
        />
      </div>
    </div>
  );
};

export default MealPlans;