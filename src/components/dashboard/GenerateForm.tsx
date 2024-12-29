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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          <AnimatedGradientText text="Create Your Meal Plan" />
        </h1>
        <p className="text-gray-600">Customize your meal plan with your preferences and requirements</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="relative">
          <Label htmlFor="mealPlanText" className="flex items-center text-gray-700 mb-2 text-lg">
            Additional Requirements
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-[280px] sm:w-[320px] p-4 bg-white/95 backdrop-blur-md" 
                align="end" 
                side="right"
                sideOffset={5}
              >
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-gray-900">Your Preferences</h3>
                  <div className="grid gap-2">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-gray-700 flex items-center">
                        <Utensils className="w-4 h-4 mr-2" />
                        Diet Type
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50/80 p-2 rounded">
                        {profile?.preferences?.diet || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-gray-700 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Allergies
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50/80 p-2 rounded">
                        {profile?.preferences?.allergies?.join(", ") || "None"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-gray-700 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Favorite Cuisines
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50/80 p-2 rounded">
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
            className="min-h-[80px] resize-none bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition duration-200"
          />
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <Label className="block text-gray-700 mb-3 text-lg">Add Ingredients from Photo</Label>
          <IngredientImageUpload onImageUploaded={handleImageUploaded} />
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <GenerateButton 
            onClick={() => onGenerate(mealPlanText, ingredientImageUrl || undefined)} 
            isLoading={isLoading} 
          />
          <Dialog>
            <DialogTrigger asChild>
              <button 
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 transition duration-200 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Adjust Parameters
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white/90 backdrop-blur-md max-w-md w-[90vw] sm:w-full mx-auto">
              <DialogHeader>
                <DialogTitle>
                  <AnimatedGradientText text="Adjust Meal Plan Parameters" className="text-xl sm:text-2xl font-semibold" />
                </DialogTitle>
                <DialogDescription>
                  Fine-tune your meal plan generation settings here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numMeals">Meals per Day</Label>
                    <Input
                      id="numMeals"
                      type="number"
                      min="1"
                      max="6"
                      value={profile?.preferences?.mealsPerDay || 3}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numDays">Number of Days</Label>
                    <Input
                      id="numDays"
                      type="number"
                      min="1"
                      max="30"
                      value={7}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
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
                  <div className="text-center mt-1 text-sm text-gray-600">2000 calories</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
};