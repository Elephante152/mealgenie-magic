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

export interface MealPlanParameters {
  mealsPerDay?: number;
  numDays?: number;
  caloricTarget?: number;
}

export interface MealPlanPreferences extends UserPreferences {
  additionalRequirements?: string;
  parameters?: MealPlanParameters;
}

export interface MealPlan {
  id: string;
  title: string;
  plan: string;
  isMinimized: boolean;
  recipeId?: string;
  isFavorited?: boolean;
  preferences?: MealPlanPreferences;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  preferences: UserPreferences;
}