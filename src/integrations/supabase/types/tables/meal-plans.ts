import type { Json } from '../json';

export interface MealPlansTable {
  meal_plans: {
    Row: {
      created_at: string;
      end_date: string | null;
      id: string;
      is_favorited: boolean | null;
      plan_name: string;
      recipes: Json;
      start_date: string | null;
      user_id: string;
    };
    Insert: {
      created_at?: string;
      end_date?: string | null;
      id?: string;
      is_favorited?: boolean | null;
      plan_name: string;
      recipes: Json;
      start_date?: string | null;
      user_id: string;
    };
    Update: {
      created_at?: string;
      end_date?: string | null;
      id?: string;
      is_favorited?: boolean | null;
      plan_name?: string;
      recipes?: Json;
      start_date?: string | null;
      user_id?: string;
    };
  };
}