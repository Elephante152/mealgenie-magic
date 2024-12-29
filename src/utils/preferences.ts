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

// Type guard to check if an object matches the UserPreferences structure
const isUserPreferences = (obj: { [key: string]: Json }): boolean => {
  return (
    typeof obj.diet === 'string' &&
    isArray(obj.cuisines) &&
    isArray(obj.allergies)
  );
};

export const hasCompletedPreferences = (preferences: Json | null): boolean => {
  if (!isObject(preferences)) return false;
  
  if (!isUserPreferences(preferences)) return false;
  
  // Now we know preferences.cuisines and preferences.allergies are arrays
  const cuisines = preferences.cuisines as Json[];
  const allergies = preferences.allergies as Json[];
  
  return !!(
    preferences.diet &&
    cuisines.length >= 0 &&
    allergies.length >= 0
  );
};