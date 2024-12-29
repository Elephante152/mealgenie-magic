export interface UserPreferences {
  diet: string;
  cuisines: string[];
  allergies: string[];
  activityLevel: string;
  calorieIntake: number;
  mealsPerDay: number;
  cookingTools: string[];
  credits: number;
}

export interface MealPlan {
  id: string;
  title: string;
  plan: string;
  isMinimized: boolean;
  recipeId?: string;
  isFavorited?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  preferences: UserPreferences;
}