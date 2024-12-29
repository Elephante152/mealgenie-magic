import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MealPlanList } from '@/components/dashboard/MealPlanList';
import { MealPlansHeader } from '@/components/dashboard/MealPlansHeader';
import { EmptyMealPlans } from '@/components/dashboard/EmptyMealPlans';
import type { MealPlan, MealPlanPreferences } from '@/types/user';

interface DBMealPlan {
  id: string;
  plan_name: string;
  recipes: string;
  created_at: string;
  user_id: string;
  start_date: string | null;
  end_date: string | null;
}

interface ParsedRecipe {
  title: string;
  ingredients: string[];
  instructions: string;
  preferences?: {
    diet?: string;
    cuisines?: string[];
    allergies?: string[];
    activityLevel?: string;
    calorieIntake?: number;
    mealsPerDay?: number;
    cookingTools?: string[];
    credits?: number;
  };
}

const createDefaultPreferences = (): MealPlanPreferences => ({
  diet: 'omnivore',
  cuisines: [],
  allergies: [],
  activityLevel: 'moderate',
  calorieIntake: 2000,
  mealsPerDay: 3,
  cookingTools: [],
  credits: 0
});

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
        let parsedRecipes: ParsedRecipe[] = [];
        try {
          parsedRecipes = JSON.parse(plan.recipes as string);
        } catch (e) {
          console.error('Error parsing recipes:', e);
        }

        const firstRecipe = parsedRecipes[0];
        const preferences: MealPlanPreferences = {
          ...createDefaultPreferences(),
          ...(firstRecipe?.preferences || {})
        };

        return {
          id: plan.id,
          title: plan.plan_name,
          plan: JSON.stringify(parsedRecipes, null, 2),
          isMinimized: false,
          preferences
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
      }));
    },
  });

  const handleClose = (id: string) => {
    // Close functionality if needed
  };

  const handleSave = async (id: string) => {
    // Toggle favorite status
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
            <Card>
              <CardHeader>
                <CardTitle>Saved Meal Plans</CardTitle>
                <CardDescription>
                  Access your previously generated and saved meal plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {isLoadingSaved ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                    </div>
                  ) : savedPlans?.length === 0 ? (
                    <EmptyMealPlans
                      message="No saved meal plans yet."
                      actionLabel="Generate a New Plan"
                    />
                  ) : (
                    <MealPlanList
                      plans={savedPlans || []}
                      onToggleMinimize={() => {}}
                      onClose={handleClose}
                      onSave={handleSave}
                      onRegenerate={handleRegenerate}
                      onDelete={handleDelete}
                    />
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorited">
            <Card>
              <CardHeader>
                <CardTitle>Favorited Plans</CardTitle>
                <CardDescription>
                  Quick access to your favorite meal plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {isLoadingFavorites ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                    </div>
                  ) : favoritedPlans?.length === 0 ? (
                    <EmptyMealPlans
                      message="No favorited meal plans yet."
                      actionLabel="Explore Plans"
                    />
                  ) : (
                    <MealPlanList
                      plans={favoritedPlans || []}
                      onToggleMinimize={() => {}}
                      onClose={handleClose}
                      onSave={handleSave}
                      onRegenerate={handleRegenerate}
                      onDelete={handleDelete}
                    />
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MealPlans;
