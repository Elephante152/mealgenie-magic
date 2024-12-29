import type { Json } from '../json';

export interface TablesBase {
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
}