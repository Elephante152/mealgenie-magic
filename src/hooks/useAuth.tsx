import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";

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

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  preferences: UserPreferences;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Safely cast the preferences data with default values
        const rawPreferences = data.preferences as Record<string, unknown>;
        const transformedProfile: UserProfile = {
          id: data.id,
          email: data.email,
          role: data.role || 'user',
          preferences: {
            diet: (rawPreferences?.diet as string) || 'omnivore',
            cuisines: Array.isArray(rawPreferences?.cuisines) ? rawPreferences.cuisines : [],
            allergies: Array.isArray(rawPreferences?.allergies) ? rawPreferences.allergies : [],
            activityLevel: (rawPreferences?.activityLevel as string) || 'Moderately Active',
            calorieIntake: Number(rawPreferences?.calorieIntake) || 2000,
            mealsPerDay: Number(rawPreferences?.mealsPerDay) || 3,
            cookingTools: Array.isArray(rawPreferences?.cookingTools) ? rawPreferences.cookingTools : [],
            credits: Number(rawPreferences?.credits) || 100
          }
        };
        setProfile(transformedProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  return {
    user,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === "admin",
  };
}