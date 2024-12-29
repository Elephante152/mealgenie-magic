import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { MealPlan, MealPlanPreferences } from "@/types/user";
import type { Recipe, MealPlanData, UserPreferences } from "@/types/meal-plans";
import { formatMealPlanContent } from "@/utils/meal-plan-formatter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

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

        const preferences = profileData?.preferences as UserPreferences || {
          diet: 'omnivore',
          cuisines: [],
          allergies: [],
          calorieIntake: 2000,
          mealsPerDay: 3,
          numDays: 7
        };
        
        const userPreferences: MealPlanPreferences = {
          diet: preferences.diet || 'omnivore',
          cuisines: Array.isArray(preferences.cuisines) ? preferences.cuisines : [],
          allergies: Array.isArray(preferences.allergies) ? preferences.allergies : [],
          parameters: {
            mealsPerDay: preferences.mealsPerDay || 3,
            numDays: preferences.numDays || 7,
            caloricTarget: preferences.calorieIntake || 2000
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