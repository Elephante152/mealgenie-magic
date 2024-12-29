import type { Recipe } from "@/types/meal-plans";
import type { MealPlanPreferences } from "@/types/user";

export const formatMealPlanContent = (recipes: Recipe[], preferences: MealPlanPreferences): string => {
  if (!recipes || recipes.length === 0) {
    return "No recipes in this meal plan yet.";
  }

  const mealsPerDay = preferences.parameters?.mealsPerDay || 3;
  const numDays = preferences.parameters?.numDays || 7;
  
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