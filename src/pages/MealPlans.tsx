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
      // First, fetch meal plans
      const { data: mealPlansData, error: mealPlansError } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (mealPlansError) {
        toast({
          title: "Error fetching meal plans",
          description: mealPlansError.message,
          variant: "destructive",
        });
        return [];
      }

      // Then, for each meal plan, fetch the associated recipes
      const plansWithRecipes = await Promise.all(mealPlansData.map(async (plan) => {
        let recipeIds = [];
        try {
          // Extract recipe IDs from the JSONB recipes field
          recipeIds = Array.isArray(plan.recipes) ? plan.recipes : [];
        } catch (e) {
          console.error('Error parsing recipe IDs:', e);
          recipeIds = [];
        }

        // Fetch recipe details if we have IDs
        let recipeDetails = [];
        if (recipeIds.length > 0) {
          const { data: recipes, error: recipesError } = await supabase
            .from('recipes')
            .select('*')
            .in('id', recipeIds);

          if (!recipesError && recipes) {
            recipeDetails = recipes;
          }
        }

        // Format the plan content
        const formattedPlan = formatMealPlanContent(recipeDetails, plan.preferences);

        return {
          id: plan.id,
          title: plan.plan_name,
          plan: formattedPlan,
          isMinimized: false,
          isFavorited: plan.is_favorited || false,
          preferences: plan.preferences || {
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
      }));

      return plansWithRecipes;
    },
  });

  const formatMealPlanContent = (recipes: any[], preferences: any) => {
    if (!recipes || recipes.length === 0) {
      return "No recipes in this meal plan yet.";
    }

    // Create a structured meal plan format
    const mealsPerDay = preferences?.parameters?.mealsPerDay || 3;
    const numDays = preferences?.parameters?.numDays || 7;
    
    let formattedContent = '';
    let recipeIndex = 0;
    
    for (let day = 1; day <= numDays; day++) {
      formattedContent += `Day ${day}:\n\n`;
      
      if (mealsPerDay >= 1) {
        const breakfast = recipes[recipeIndex] || { title: 'Recipe coming soon' };
        formattedContent += `Breakfast:\n- ${breakfast.title}\n\n`;
        recipeIndex++;
      }
      
      if (mealsPerDay >= 2) {
        const lunch = recipes[recipeIndex] || { title: 'Recipe coming soon' };
        formattedContent += `Lunch:\n- ${lunch.title}\n\n`;
        recipeIndex++;
      }
      
      if (mealsPerDay >= 3) {
        const dinner = recipes[recipeIndex] || { title: 'Recipe coming soon' };
        formattedContent += `Dinner:\n- ${dinner.title}\n\n`;
        recipeIndex++;
      }
    }

    return formattedContent;
  };

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