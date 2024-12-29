import type { Json } from "@/integrations/supabase/types";
import type { UserPreferences } from "@/types/user";

// Type guard to check if a value is a non-null object
const isObject = (value: Json | null): value is { [key: string]: Json } => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

// Type guard to check if a value is an array
const isArray = (value: Json | undefined): value is Json[] => {
  return Array.isArray(value);
};

// Type guard to check if the object has the required UserPreferences properties
const isUserPreferences = (obj: { [key: string]: Json }): obj is UserPreferences => {
  return (
    typeof obj.diet === 'string' &&
    isArray(obj.cuisines) &&
    isArray(obj.allergies)
  );
};

export const hasCompletedPreferences = (preferences: Json | null): boolean => {
  if (!isObject(preferences)) return false;
  
  if (!isUserPreferences(preferences)) return false;
  
  return !!(
    preferences.diet &&
    preferences.cuisines.length >= 0 &&
    preferences.allergies.length >= 0
  );
};