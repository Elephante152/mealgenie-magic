import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HelpCircle, Utensils, AlertTriangle, Globe } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { GenerateButton } from './GenerateButton';
import { AnimatedGradientText } from '@/components/landing/AnimatedGradientText';
import { IngredientImageUpload } from './IngredientImageUpload';
import type { UserProfile } from '@/types/user';

interface GenerateFormProps {
  profile: UserProfile | null;
  isLoading: boolean;
  onGenerate: (text: string, imageUrl?: string) => void;
}

export const GenerateForm = ({ profile, isLoading, onGenerate }: GenerateFormProps) => {
  const [mealPlanText, setMealPlanText] = useState('');
  const [ingredientImageUrl, setIngredientImageUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(mealPlanText, ingredientImageUrl || undefined);
  };

  const handleImageUploaded = (imageUrl: string) => {
    setIngredientImageUrl(imageUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <div className="relative">
        <Label htmlFor="mealPlanText" className="flex items-center text-gray-700">
          Additional Requirements
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-2">
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-80 p-6 bg-white/95 backdrop-blur-md" 
              align="end" 
              side="right"
              sideOffset={5}
            >
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Your Preferences</h3>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm text-gray-700 flex items-center">
                      <Utensils className="w-4 h-4 mr-2" />
                      Diet Type
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      {profile?.preferences?.diet || "Not set"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm text-gray-700 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Allergies
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      {profile?.preferences?.allergies?.join(", ") || "None"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm text-gray-700 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Favorite Cuisines
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      {profile?.preferences?.cuisines?.join(", ") || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Label>
        <Textarea
          id="mealPlanText"
          placeholder="Enter any specific requirements for your meal plan..."
          value={mealPlanText}
          onChange={(e) => setMealPlanText(e.target.value)}
          className="mt-2 h-20 resize-none bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition duration-200"
        />
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
        <Label className="mb-2 block text-gray-700">Add Ingredients from Photo</Label>
        <IngredientImageUpload onImageUploaded={handleImageUploaded} />
      </div>

      <div className="flex flex-col items-center space-y-4">
        <GenerateButton onClick={() => onGenerate(mealPlanText, ingredientImageUrl || undefined)} isLoading={isLoading} />
        <Dialog>
          <DialogTrigger asChild>
            <button 
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
            >
              Adjust Parameters
            </button>
          </DialogTrigger>
          <DialogContent className="bg-white/90 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>
                <AnimatedGradientText text="Adjust Meal Plan Parameters" className="text-2xl font-semibold" />
              </DialogTitle>
              <DialogDescription>
                Fine-tune your meal plan generation settings here.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="numMeals">Meals per Day</Label>
                  <Input
                    id="numMeals"
                    type="number"
                    min="1"
                    max="6"
                    value={profile?.preferences?.mealsPerDay || 3}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="numDays">Number of Days</Label>
                  <Input
                    id="numDays"
                    type="number"
                    min="1"
                    max="30"
                    value={7}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="caloricTarget">Daily Caloric Target</Label>
                <div className="relative mt-2">
                  <Slider
                    id="caloricTarget"
                    min={1000}
                    max={4000}
                    step={50}
                    value={[2000]}
                    className="z-10 relative"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-500 rounded-md opacity-50" 
                    style={{ filter: 'blur(4px)' }} 
                  />
                </div>
                <div className="text-center mt-1">2000 calories</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </form>
  );
};