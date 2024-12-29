import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target } from "lucide-react";
import type { MealPlan } from "@/types/user";

interface MealPlanPreviewCardProps {
  plan: MealPlan;
  onClick: () => void;
}

export const MealPlanPreviewCard = ({ plan, onClick }: MealPlanPreviewCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
          {plan.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plan.preferences && (
            <>
              <div className="flex flex-wrap gap-2">
                {plan.preferences.diet && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                    {plan.preferences.diet}
                  </Badge>
                )}
                {plan.preferences.allergies?.map((allergy) => (
                  <Badge key={allergy} variant="secondary" className="bg-red-50 text-red-700">
                    No {allergy}
                  </Badge>
                ))}
                {plan.preferences.cuisines?.map((cuisine) => (
                  <Badge key={cuisine} variant="secondary" className="bg-blue-50 text-blue-700">
                    {cuisine}
                  </Badge>
                ))}
              </div>
              {plan.preferences.parameters && (
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {plan.preferences.parameters.mealsPerDay && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{plan.preferences.parameters.mealsPerDay} meals/day</span>
                    </div>
                  )}
                  {plan.preferences.parameters.caloricTarget && (
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{plan.preferences.parameters.caloricTarget} calories/day</span>
                    </div>
                  )}
                  {plan.preferences.parameters.numDays && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{plan.preferences.parameters.numDays} days</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};