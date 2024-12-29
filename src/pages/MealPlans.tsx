import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MealPlanDisplay } from '@/components/dashboard/MealPlanDisplay';
import { MealPlansHeader } from '@/components/dashboard/MealPlansHeader';
import { useMealPlans } from "@/hooks/use-meal-plans";

const MealPlans = () => {
  const { toast } = useToast();
  const { data: mealPlans, isLoading } = useMealPlans();

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
