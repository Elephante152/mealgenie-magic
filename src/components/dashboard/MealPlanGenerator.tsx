import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GenerateForm } from './GenerateForm';
import { triggerConfetti } from '@/utils/confetti';
import type { MealPlan } from '@/types/user';

interface MealPlanGeneratorProps {
  onPlanGenerated: (plan: MealPlan) => void;
  credits: number;
  onCreditsUpdate: (newCredits: number) => void;
}

export const MealPlanGenerator = ({ onPlanGenerated, credits, onCreditsUpdate }: MealPlanGeneratorProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

      console.log('Calling generate-meal-plan with session token:', session.access_token);

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

      if (response.error) {
        console.error('Generation error:', response.error);
        throw new Error(response.error.message || 'Failed to generate meal plan');
      }

      const { data } = response;
      const newPlan: MealPlan = {
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
      };

      onPlanGenerated(newPlan);

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

      onCreditsUpdate(credits - 10);
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
  }, [profile?.preferences, isLoading, credits, toast, onPlanGenerated, onCreditsUpdate]);

  return (
    <GenerateForm
      profile={profile}
      isLoading={isLoading}
      onGenerate={handleGenerate}
    />
  );
};