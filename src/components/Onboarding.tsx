import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const DIETS = ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"];
const CUISINES = ["Italian", "Mexican", "Indian", "Chinese", "Japanese", "Thai", "Mediterranean", "American"];
const ALLERGIES = ["dairy", "eggs", "fish", "shellfish", "tree-nuts", "peanuts", "wheat", "soy"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [diet, setDiet] = useState("omnivore");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

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

  useEffect(() => {
    // Calculate progress based on filled fields
    let points = 0;
    if (diet) points += 33;
    if (selectedCuisines.length > 0) points += 33;
    if (selectedAllergies.length > 0) points += 34;
    setProgress(points);
  }, [diet, selectedCuisines, selectedAllergies]);

  const handleSubmit = async () => {
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
            diet,
            cuisines: selectedCuisines,
            allergies: selectedAllergies,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white relative">
        {saving && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome! Let's personalize your experience
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us about your dietary preferences
          </p>
        </div>

        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-500 text-center">Profile completion: {progress}%</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Dietary Preference</Label>
            <Select value={diet} onValueChange={setDiet}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIETS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Favorite Cuisines</Label>
            <Select
              value={selectedCuisines[0] || ""}
              onValueChange={(value) => setSelectedCuisines([...selectedCuisines, value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cuisines..." />
              </SelectTrigger>
              <SelectContent>
                {CUISINES.filter((c) => !selectedCuisines.includes(c)).map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCuisines.map((cuisine) => (
                <Button
                  key={cuisine}
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisine))}
                >
                  {cuisine} ×
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allergies</Label>
            <Select
              value={selectedAllergies[0] || ""}
              onValueChange={(value) => setSelectedAllergies([...selectedAllergies, value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select allergies..." />
              </SelectTrigger>
              <SelectContent>
                {ALLERGIES.filter((a) => !selectedAllergies.includes(a)).map((allergy) => (
                  <SelectItem key={allergy} value={allergy}>
                    {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedAllergies.map((allergy) => (
                <Button
                  key={allergy}
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy))}
                >
                  {allergy} ×
                </Button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={saving || progress < 33}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}