import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { MealPlan, MealPlanPreferences } from "@/types/user";
import type { Recipe, MealPlanData, UserPreferences } from "@/types/meal-plans";
import { formatMealPlanContent } from "@/utils/meal-plan-formatter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Helper function to safely transform JSON to UserPreferences
const transformToUserPreferences = (json: any): UserPreferences => {
  return {
    diet: typeof json?.diet === 'string' ? json.diet : 'omnivore',
    cuisines: Array.isArray(json?.cuisines) ? json.cuisines : [],
    allergies: Array.isArray(json?.allergies) ? json.allergies : [],
    calorieIntake: typeof json?.calorieIntake === 'number' ? json.calorieIntake : 2000,
    mealsPerDay: typeof json?.mealsPerDay === 'number' ? json.mealsPerDay : 3,
    numDays: typeof json?.numDays === 'number' ? json.numDays : 7
  };
};

export const useMealPlans = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['meal-plans', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data: mealPlansData, error: mealPlansError } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (mealPlansError) {
        toast({
          title: "Error fetching meal plans",
          description: mealPlansError.message,
          variant: "destructive",
        });
        return [];
      }

      const plansWithRecipes = await Promise.all((mealPlansData as MealPlanData[]).map(async (plan) => {
        const recipeIds = Array.isArray(plan.recipes) ? plan.recipes : [];

        let recipeDetails: Recipe[] = [];
        if (recipeIds.length > 0) {
          const { data: recipes, error: recipesError } = await supabase
            .from('recipes')
            .select('*')
            .in('id', recipeIds);

          if (!recipesError && recipes) {
            recipeDetails = recipes as Recipe[];
          }
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        const preferences = transformToUserPreferences(profileData?.preferences);
        
        const userPreferences: MealPlanPreferences = {
          diet: preferences.diet,
          cuisines: preferences.cuisines,
          allergies: preferences.allergies,
          parameters: {
            mealsPerDay: preferences.mealsPerDay,
            numDays: preferences.numDays,
            caloricTarget: preferences.calorieIntake
          }
        };

        const transformedPlan: MealPlan = {
          id: plan.id,
          title: plan.plan_name,
          plan: formatMealPlanContent(recipeDetails, userPreferences),
          isMinimized: false,
          isFavorited: plan.is_favorited || false,
          preferences: userPreferences
        };

        return transformedPlan;
      }));

      return plansWithRecipes;
    },
    enabled: !!user,
  });
};