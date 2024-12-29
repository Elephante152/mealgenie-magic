import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealPlanDisplay } from '@/components/dashboard/MealPlanDisplay';
import { MealPlansHeader } from '@/components/dashboard/MealPlansHeader';
import type { MealPlan } from '@/types/user';

interface DBMealPlan {
  id: string;
  plan_name: string;
  recipes: string;
  created_at: string;
  user_id: string;
  start_date: string | null;
  end_date: string | null;
}

const MealPlans = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("saved");

  const { data: savedPlans, isLoading: isLoadingSaved } = useQuery({
    queryKey: ['saved-meal-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching saved meal plans",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data.map((plan: DBMealPlan) => {
        let parsedRecipes = [];
        try {
          parsedRecipes = JSON.parse(plan.recipes);
        } catch (e) {
          console.error('Error parsing recipes:', e);
        }

        return {
          id: plan.id,
          title: plan.plan_name,
          plan: typeof parsedRecipes === 'string' ? parsedRecipes : JSON.stringify(parsedRecipes, null, 2),
          isMinimized: false,
          preferences: {
            diet: 'omnivore',
            cuisines: [],
            allergies: [],
            activityLevel: 'moderate',
            calorieIntake: 2000,
            mealsPerDay: 3,
            cookingTools: [],
            credits: 0
          }
        };
      });
    },
  });

  const { data: favoritedPlans, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorited-meal-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          recipe_id,
          recipes:recipes (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching favorited meal plans",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data.map(favorite => ({
        id: favorite.recipes.id,
        title: favorite.recipes.title,
        plan: JSON.stringify(favorite.recipes.ingredients, null, 2),
        isMinimized: false,
        isFavorited: true,
        preferences: {
          diet: 'omnivore',
          cuisines: [],
          allergies: [],
          activityLevel: 'moderate',
          calorieIntake: 2000,
          mealsPerDay: 3,
          cookingTools: [],
          credits: 0
        }
      }));
    },
  });

  const handleClose = (id: string) => {
    // Close functionality if needed
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ recipe_id: id });

    if (error) {
      toast({
        title: "Error removing from favorites",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Removed from favorites",
        description: "The meal plan has been removed from your favorites.",
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

        <Tabs defaultValue="saved" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Saved Plans
            </TabsTrigger>
            <TabsTrigger value="favorited" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            <MealPlanDisplay
              plans={savedPlans}
              isLoading={isLoadingSaved}
              onClose={handleClose}
              onSave={handleSave}
              onRegenerate={handleRegenerate}
              onDelete={handleDelete}
              type="saved"
            />
          </TabsContent>

          <TabsContent value="favorited">
            <MealPlanDisplay
              plans={favoritedPlans}
              isLoading={isLoadingFavorites}
              onClose={handleClose}
              onSave={handleSave}
              onRegenerate={handleRegenerate}
              onDelete={handleDelete}
              type="favorited"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MealPlans;