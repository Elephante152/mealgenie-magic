import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { PreferencesForm } from "./onboarding/PreferencesForm";
import { AnimatedGradientText } from "./ui/animated-gradient-text";

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (preferences: any) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          preferences: {
            diet: preferences.dietType.toLowerCase(),
            cuisines: preferences.favoriteCuisines,
            allergies: preferences.allergies.split(',').map((a: string) => a.trim()),
            activityLevel: preferences.activityLevel,
            calorieIntake: preferences.calorieIntake,
            mealsPerDay: preferences.mealsPerDay,
            cookingTools: preferences.preferredCookingTools,
          },
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Welcome aboard! 🎉",
        description: "Your preferences have been saved successfully.",
      });

      navigate("/");
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
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-xl p-8 max-w-3xl w-full"
      >
        <AnimatedGradientText 
          text="Welcome! Let's Personalize Your Experience" 
          className="text-3xl font-bold mb-6 text-center block" 
        />
        
        <p className="text-gray-600 text-center mb-8">
          Tell us about your preferences to get personalized meal recommendations.
        </p>

        <Progress value={progress} className="h-2 mb-6" />
        
        <PreferencesForm onSubmit={handleSubmit} isLoading={saving} />

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
}