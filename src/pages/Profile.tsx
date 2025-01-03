import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreferencesForm } from "@/components/onboarding/PreferencesForm";
import { AnimatedGradientText } from "@/components/landing/AnimatedGradientText";
import { triggerConfetti } from "@/utils/confetti";
import { EmojiBackground } from "@/components/dashboard/EmojiBackground";
import type { UserPreferences } from "@/types/user";
import type { Json } from "@/integrations/supabase/types";

interface ProfilePreferences {
  dietType: string;
  favoriteCuisines: string[];
  allergies: string;
  activityLevel: string;
  calorieIntake: number;
  mealsPerDay: number;
  preferredCookingTools: string[];
}

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<ProfilePreferences | null>(null);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (profile?.preferences) {
          const rawPrefs = profile.preferences as unknown as UserPreferences;
          setPreferences({
            dietType: rawPrefs.diet || 'omnivore',
            favoriteCuisines: rawPrefs.cuisines || [],
            allergies: (rawPrefs.allergies || []).join(', '),
            activityLevel: rawPrefs.activityLevel || 'Moderately Active',
            calorieIntake: rawPrefs.calorieIntake || 2000,
            mealsPerDay: rawPrefs.mealsPerDay || 3,
            preferredCookingTools: rawPrefs.cookingTools || [],
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching preferences:", error);
        toast({
          title: "Error",
          description: "Failed to load preferences. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchUserPreferences();
  }, [navigate, toast]);

  const handleSubmit = async (updatedPreferences: ProfilePreferences) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const preferencesData: Json = {
        diet: updatedPreferences.dietType.toLowerCase(),
        cuisines: updatedPreferences.favoriteCuisines,
        allergies: updatedPreferences.allergies.split(',').map(a => a.trim()),
        activityLevel: updatedPreferences.activityLevel,
        calorieIntake: updatedPreferences.calorieIntake,
        mealsPerDay: updatedPreferences.mealsPerDay,
        cookingTools: updatedPreferences.preferredCookingTools,
      };

      const { error } = await supabase
        .from("profiles")
        .update({
          preferences: preferencesData,
        })
        .eq("id", user.id);

      if (error) throw error;

      triggerConfetti();
      
      toast({
        title: "Success! 🎉",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-600">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <EmojiBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="text-center mb-8">
            <AnimatedGradientText 
              text="Your Preferences" 
              className="text-4xl sm:text-5xl font-bold mb-4" 
            />
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Update your preferences to get more personalized meal recommendations.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-gray-600">Loading your preferences...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 sm:p-8 md:p-12">
              {preferences && (
                <PreferencesForm 
                  onSubmit={handleSubmit} 
                  isLoading={saving}
                  initialValues={preferences}
                />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}