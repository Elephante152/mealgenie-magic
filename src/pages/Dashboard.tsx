import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { EmojiBackground } from '@/components/dashboard/EmojiBackground';
import { MealPlanList } from '@/components/dashboard/MealPlanList';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { GenerateForm } from '@/components/dashboard/GenerateForm';
import { triggerConfetti } from '@/utils/confetti';
import type { MealPlan } from '@/types/user';

export default function Dashboard() {
  const { profile, user } = useAuth(); // Add user to destructuring
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlans, setGeneratedPlans] = useState<MealPlan[]>([]);
  const [credits, setCredits] = useState(profile?.preferences?.credits || 100);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleGenerate = useCallback(async (mealPlanText: string, imageUrl?: string) => {
    if (isLoading) return;
    if (credits < 10) {
      toast({
        title: "Insufficient Credits",
        description: "Please refill your credits to generate more meal plans.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          preferences: profile?.preferences,
          additionalRequirements: mealPlanText,
          ingredientImageUrl: imageUrl,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw new Error('Failed to generate meal plan');

      const { data } = response;
      setGeneratedPlans(prev => [...prev, {
        id: crypto.randomUUID(),
        title: data.mealPlan.plan_name,
        plan: data.recipes.map((recipe: any) => `
Recipe: ${recipe.title}

Ingredients:
${recipe.ingredients.join('\n')}

Instructions:
${recipe.instructions}
        `).join('\n\n'),
        isMinimized: false,
        recipeId: data.mealPlan.id,
        isFavorited: false,
        preferences: {
          ...profile?.preferences,
          additionalRequirements: mealPlanText,
        }
      }]);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          preferences: {
            ...profile?.preferences,
            credits: (profile?.preferences?.credits || 0) - 10
          }
        })
        .eq('id', profile?.id);

      if (updateError) throw updateError;

      setCredits(prev => prev - 10);
      triggerConfetti();
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [profile?.preferences, isLoading, credits, toast]);

  const toggleMinimize = (id: string) => {
    setGeneratedPlans(prev =>
      prev.map(plan =>
        plan.id === id ? { ...plan, isMinimized: !plan.isMinimized } : plan
      )
    );
  };

  const closePlan = (id: string) => {
    setGeneratedPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const deletePlan = async (id: string) => {
    try {
      const planToDelete = generatedPlans.find(plan => plan.id === id);
      if (!planToDelete || !planToDelete.recipeId) return;

      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', planToDelete.recipeId);

      if (error) throw error;

      closePlan(id);
      toast({
        title: "Plan deleted",
        description: "The meal plan has been deleted successfully.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete the meal plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const savePlan = async (id: string) => {
    const planToSave = generatedPlans.find(plan => plan.id === id);
    if (!planToSave) return;

    try {
      // First, save the meal plan as a recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: planToSave.title,
          ingredients: [], // We'll need to parse these from the plan text
          instructions: planToSave.plan,
          user_id: profile?.id,
          is_public: false
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Then, save to favorites using the new recipe ID
      const { error: favoriteError } = await supabase
        .from('favorites')
        .upsert({
          user_id: profile?.id,
          recipe_id: recipeData.id,
        });

      if (favoriteError) throw favoriteError;

      // Update the local state with the new recipe ID and favorite status
      setGeneratedPlans(prev =>
        prev.map(plan =>
          plan.id === id 
            ? { ...plan, recipeId: recipeData.id, isFavorited: !plan.isFavorited } 
            : plan
        )
      );

      toast({
        title: planToSave.isFavorited ? "Removed from favorites" : "Added to favorites",
        description: planToSave.isFavorited 
          ? "The meal plan has been removed from your favorites."
          : "The meal plan has been saved to your favorites.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const regeneratePlan = async (id: string) => {
    if (credits < 10) {
      toast({
        title: "Insufficient Credits",
        description: "Please refill your credits to regenerate meal plans.",
        variant: "destructive",
      });
      return;
    }
    
    await handleGenerate("");
    closePlan(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden">
      <EmojiBackground />
      <DashboardHeader isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-8">
        <motion.div
          className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-lg p-6 w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GenerateForm
            profile={profile}
            isLoading={isLoading}
            onGenerate={handleGenerate}
          />
        </motion.div>
      </main>

      <MealPlanList
        plans={generatedPlans}
        onToggleMinimize={toggleMinimize}
        onClose={closePlan}
        onSave={savePlan}
        onRegenerate={regeneratePlan}
        onDelete={deletePlan}
      />

      <DashboardFooter credits={credits} />
    </div>
  );
}