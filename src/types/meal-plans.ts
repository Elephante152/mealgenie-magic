import type { Json } from "@/integrations/supabase/types";

export interface UserPreferences {
  diet: string;
  cuisines: string[];
  allergies: string[];
  mealsPerDay?: number;
  numDays?: number;
  calorieIntake?: number;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: Json;
  instructions: string;
  image_url?: string;
}

export interface MealPlanData {
  id: string;
  user_id: string;
  plan_name: string;
  recipes: string[];
  start_date: string | null;
  end_date: string | null;
  is_favorited: boolean | null;
  created_at: string;
}