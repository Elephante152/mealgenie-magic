import type { Json } from '../json';

export interface RecipesTable {
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
}