import { useState } from "react";
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
}

export const PreferencesForm = ({ onSubmit, isLoading }: PreferencesFormProps) => {
  const [dietType, setDietType] = useState('Omnivore');
  const [allergies, setAllergies] = useState('');
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState('Moderately Active');
  const [calorieIntake, setCalorieIntake] = useState(2000);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [preferredCookingTools, setPreferredCookingTools] = useState<string[]>([]);

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center">
          <Utensils className="w-5 h-5 mr-2" />
          Diet Type
        </Label>
        <RadioGroup value={dietType} onValueChange={setDietType} className="grid grid-cols-2 gap-4">
          {DIET_TYPES.map(diet => (
            <div key={diet} className="relative">
              <RadioGroupItem value={diet} id={diet} className="peer sr-only" />
              <Label
                htmlFor={diet}
                className={`flex items-center justify-center px-4 py-3 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  dietType === diet
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                }`}
              >
                {diet}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Activity Level
        </Label>
        <RadioGroup value={activityLevel} onValueChange={setActivityLevel} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACTIVITY_LEVELS.map(level => (
            <div key={level} className="relative">
              <RadioGroupItem value={level} id={level} className="peer sr-only" />
              <Label
                htmlFor={level}
                className={`flex items-center justify-center px-4 py-3 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  activityLevel === level
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                }`}
              >
                {level}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies" className="text-lg font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Allergies
        </Label>
        <Textarea
          id="allergies"
          placeholder="Enter any allergies or intolerances..."
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-semibold flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Favorite Cuisines
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CUISINES.map(cuisine => (
            <div key={cuisine} className="flex items-center space-x-2">
              <Switch
                id={cuisine}
                checked={favoriteCuisines.includes(cuisine)}
                onCheckedChange={() => handleCuisineToggle(cuisine)}
              />
              <Label htmlFor={cuisine}>{cuisine}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="calorieIntake" className="text-lg font-semibold flex items-center">
          <BarChart className="w-5 h-5 mr-2" />
          Daily Calorie Intake
        </Label>
        <div className="flex items-center space-x-4">
          <Slider
            id="calorieIntake"
            min={1000}
            max={4000}
            step={50}
            value={[calorieIntake]}
            onValueChange={(value) => setCalorieIntake(value[0])}
            className="flex-grow"
          />
          <span className="text-gray-700 font-medium">{calorieIntake} cal</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-semibold flex items-center">
          <Coffee className="w-5 h-5 mr-2" />
          Preferred Cooking Tools
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COOKING_TOOLS.map(tool => (
            <div key={tool} className="flex items-center space-x-2">
              <Switch
                id={tool}
                checked={preferredCookingTools.includes(tool)}
                onCheckedChange={() => handleCookingToolToggle(tool)}
              />
              <Label htmlFor={tool}>{tool}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-emerald-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-600 transition-colors"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          {isLoading ? 'Saving...' : 'Create My Personalized Experience'}
        </Button>
      </div>
    </form>
  );
};