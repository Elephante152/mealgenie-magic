import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DIETS = ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"];
const CUISINES = ["Italian", "Mexican", "Indian", "Chinese", "Japanese", "Thai", "Mediterranean", "American"];
const ALLERGIES = ["dairy", "eggs", "fish", "shellfish", "tree-nuts", "peanuts", "wheat", "soy"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [diet, setDiet] = useState("omnivore");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const handleSubmit = async () => {
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
        title: "Preferences saved!",
        description: "Your profile has been updated successfully.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome! Let's personalize your experience
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us about your dietary preferences
          </p>
        </div>

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

          <Button className="w-full" onClick={handleSubmit}>
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}