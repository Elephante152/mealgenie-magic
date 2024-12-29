import type { Tables } from './tables';

export type Database = {
  public: {
    Tables: {
      favorites: Tables['favorites'];
      feedback: Tables['feedback'];
      logs: Tables['logs'];
      meal_plans: Tables['meal_plans'];
      profiles: Tables['profiles'];
      recipe_tags: Tables['recipe_tags'];
      recipes: Tables['recipes'];
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};