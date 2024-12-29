import type { Json } from "@/integrations/supabase/types";
import type { UserPreferences } from "@/types/user";

export const hasCompletedPreferences = (preferences: Json | null): boolean => {
  if (!preferences || typeof preferences !== 'object') return false;
  
  const prefs = preferences as UserPreferences;
  return !!(
    prefs.diet &&
    Array.isArray(prefs.cuisines) &&
    Array.isArray(prefs.allergies)
  );
};