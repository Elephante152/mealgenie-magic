import { useState, useEffect } from "react";
import { Utensils, AlertTriangle, Globe, Activity, BarChart, Coffee, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const DIET_TYPES = ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo'];
const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active'];
const CUISINES = ['Italian', 'Mexican', 'Japanese', 'Indian', 'American', 'French', 'Thai', 'Mediterranean'];
const COOKING_TOOLS = ['Stove top', 'Oven', 'Microwave', 'Slow cooker', 'Pressure cooker', 'Air fryer', 'Grill', 'Blender'];

interface PreferencesFormProps {
  onSubmit: (preferences: any) => void;
  isLoading?: boolean;
  initialValues?: {
    dietType: string;
    allergies: string;
    favoriteCuisines: string[];
    activityLevel: string;
    calorieIntake: number;
    mealsPerDay: number;
    preferredCookingTools: string[];
  };
}

export const PreferencesForm = ({ onSubmit, isLoading, initialValues }: PreferencesFormProps) => {
  const [dietType, setDietType] = useState(initialValues?.dietType || 'Omnivore');
  const [allergies, setAllergies] = useState(initialValues?.allergies || '');
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>(initialValues?.favoriteCuisines || []);
  const [activityLevel, setActivityLevel] = useState(initialValues?.activityLevel || 'Moderately Active');
  const [calorieIntake, setCalorieIntake] = useState(initialValues?.calorieIntake || 2000);
  const [mealsPerDay, setMealsPerDay] = useState(initialValues?.mealsPerDay || 3);
  const [preferredCookingTools, setPreferredCookingTools] = useState<string[]>(initialValues?.preferredCookingTools || []);

  useEffect(() => {
    if (initialValues) {
      setDietType(initialValues.dietType);
      setAllergies(initialValues.allergies);
      setFavoriteCuisines(initialValues.favoriteCuisines);
      setActivityLevel(initialValues.activityLevel);
      setCalorieIntake(initialValues.calorieIntake);
      setMealsPerDay(initialValues.mealsPerDay);
      setPreferredCookingTools(initialValues.preferredCookingTools);
    }
  }, [initialValues]);

  const handleCuisineToggle = (cuisine: string) => {
    setFavoriteCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  const handleCookingToolToggle = (tool: string) => {
    setPreferredCookingTools(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      dietType,
      allergies,
      favoriteCuisines,
      activityLevel,
      calorieIntake,
      mealsPerDay,
      preferredCookingTools
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <Label className="text-xl font-semibold flex items-center">
          <Utensils className="w-5 h-5 mr-2" />
          Diet Type
        </Label>
        <RadioGroup 
          value={dietType} 
          onValueChange={setDietType} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {DIET_TYPES.map(diet => (
            <div key={diet} className="relative">
              <RadioGroupItem value={diet} id={diet} className="peer sr-only" />
              <Label
                htmlFor={diet}
                className="flex items-center justify-center px-4 py-3 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700"
              >
                {diet}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-6">
        <Label className="text-xl font-semibold flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Activity Level
        </Label>
        <RadioGroup 
          value={activityLevel} 
          onValueChange={setActivityLevel} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {ACTIVITY_LEVELS.map(level => (
            <div key={level} className="relative">
              <RadioGroupItem value={level} id={level} className="peer sr-only" />
              <Label
                htmlFor={level}
                className="flex items-center justify-center px-4 py-3 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700"
              >
                {level}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label htmlFor="allergies" className="text-xl font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Allergies
        </Label>
        <Textarea
          id="allergies"
          placeholder="Enter any allergies or intolerances..."
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="min-h-[100px] bg-white"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-xl font-semibold flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Favorite Cuisines
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CUISINES.map(cuisine => (
            <div key={cuisine} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
              <Switch
                id={cuisine}
                checked={favoriteCuisines.includes(cuisine)}
                onCheckedChange={() => handleCuisineToggle(cuisine)}
              />
              <Label htmlFor={cuisine} className="cursor-pointer">{cuisine}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="calorieIntake" className="text-xl font-semibold flex items-center">
          <BarChart className="w-5 h-5 mr-2" />
          Daily Calorie Intake
        </Label>
        <div className="bg-white p-6 rounded-lg space-y-6">
          <Slider
            id="calorieIntake"
            min={1000}
            max={4000}
            step={50}
            value={[calorieIntake]}
            onValueChange={(value) => setCalorieIntake(value[0])}
          />
          <div className="text-center font-medium text-lg text-emerald-600">
            {calorieIntake} calories per day
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-xl font-semibold flex items-center">
          <Coffee className="w-5 h-5 mr-2" />
          Preferred Cooking Tools
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COOKING_TOOLS.map(tool => (
            <div key={tool} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
              <Switch
                id={tool}
                checked={preferredCookingTools.includes(tool)}
                onCheckedChange={() => handleCookingToolToggle(tool)}
              />
              <Label htmlFor={tool} className="cursor-pointer">{tool}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 flex justify-center">
        <Button 
          type="submit" 
          disabled={isLoading}
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors w-full sm:w-auto"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          {isLoading ? 'Saving...' : 'Update Preferences'}
        </Button>
      </div>
    </form>
  );
};