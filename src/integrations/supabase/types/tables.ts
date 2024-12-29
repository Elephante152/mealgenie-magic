import type { Json } from './json';

export interface Tables {
  favorites: {
    Row: {
      created_at: string;
      id: string;
      recipe_id: string;
      user_id: string;
    };
    Insert: {
      created_at?: string;
      id?: string;
      recipe_id: string;
      user_id: string;
    };
    Update: {
      created_at?: string;
      id?: string;
      recipe_id?: string;
      user_id?: string;
    };
  };
  feedback: {
    Row: {
      created_at: string;
      id: string;
      message: string;
      rating: number | null;
      recipe_id: string | null;
      user_id: string | null;
    };
    Insert: {
      created_at?: string;
      id?: string;
      message: string;
      rating?: number | null;
      recipe_id?: string | null;
      user_id?: string | null;
    };
    Update: {
      created_at?: string;
      id?: string;
      message?: string;
      rating?: number | null;
      recipe_id?: string | null;
      user_id?: string | null;
    };
  };
  logs: {
    Row: {
      action: string;
      id: string;
      metadata: Json | null;
      timestamp: string;
      user_id: string | null;
    };
    Insert: {
      action: string;
      id?: string;
      metadata?: Json | null;
      timestamp?: string;
      user_id?: string | null;
    };
    Update: {
      action?: string;
      id?: string;
      metadata?: Json | null;
      timestamp?: string;
      user_id?: string | null;
    };
  };
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
  profiles: {
    Row: {
      created_at: string;
      email: string;
      id: string;
      preferences: Json | null;
      role: string | null;
      updated_at: string;
    };
    Insert: {
      created_at?: string;
      email: string;
      id: string;
      preferences?: Json | null;
      role?: string | null;
      updated_at?: string;
    };
    Update: {
      created_at?: string;
      email?: string;
      id?: string;
      preferences?: Json | null;
      role?: string | null;
      updated_at?: string;
    };
  };
  recipe_tags: {
    Row: {
      id: string;
      recipe_id: string;
      tag: string;
    };
    Insert: {
      id?: string;
      recipe_id: string;
      tag: string;
    };
    Update: {
      id?: string;
      recipe_id?: string;
      tag?: string;
    };
  };
  recipes: {
    Row: {
      created_at: string;
      id: string;
      image_url: string | null;
      ingredients: Json;
      instructions: string;
      is_public: boolean | null;
      title: string;
      user_id: string | null;
    };
    Insert: {
      created_at?: string;
      id?: string;
      image_url?: string | null;
      ingredients: Json;
      instructions: string;
      is_public?: boolean | null;
      title: string;
      user_id?: string | null;
    };
    Update: {
      created_at?: string;
      id?: string;
      image_url?: string | null;
      ingredients?: Json;
      instructions?: string;
      is_public?: boolean | null;
      title?: string;
      user_id?: string | null;
    };
  };
}

export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];