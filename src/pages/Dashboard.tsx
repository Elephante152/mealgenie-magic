import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmojiBackground } from '@/components/dashboard/EmojiBackground';
import { MealPlanList } from '@/components/dashboard/MealPlanList';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { MealPlanGenerator } from '@/components/dashboard/MealPlanGenerator';
import type { MealPlan } from '@/types/user';

export default function Dashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [generatedPlans, setGeneratedPlans] = useState<MealPlan[]>([]);
  const [credits, setCredits] = useState(profile?.preferences?.credits || 100);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handlePlanGenerated = (newPlan: MealPlan) => {
    setGeneratedPlans(prev => [...prev, newPlan]);
  };

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
    
    closePlan(id);
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
          <MealPlanGenerator
            onPlanGenerated={handlePlanGenerated}
            credits={credits}
            onCreditsUpdate={setCredits}
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