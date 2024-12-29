import { Badge } from "@/components/ui/badge"
import { Clock, Target, Calendar } from 'lucide-react'
import type { MealPlanPreferences } from "@/types/user"

interface MealPlanPreferencesDisplayProps {
  preferences: MealPlanPreferences;
}

export const MealPlanPreferencesDisplay = ({ preferences }: MealPlanPreferencesDisplayProps) => {
  if (!preferences) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap gap-2">
        {preferences.diet && (
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
            {preferences.diet}
          </Badge>
        )}
        {preferences.allergies?.map((allergy) => (
          <Badge key={allergy} variant="secondary" className="bg-red-50 text-red-700">
            No {allergy}
          </Badge>
        ))}
        {preferences.cuisines?.map((cuisine) => (
          <Badge key={cuisine} variant="secondary" className="bg-blue-50 text-blue-700">
            {cuisine}
          </Badge>
        ))}
      </div>
      {preferences.parameters && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {preferences.parameters.mealsPerDay && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{preferences.parameters.mealsPerDay} meals/day</span>
            </div>
          )}
          {preferences.parameters.caloricTarget && (
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{preferences.parameters.caloricTarget} calories/day</span>
            </div>
          )}
          {preferences.parameters.numDays && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{preferences.parameters.numDays} days</span>
            </div>
          )}
        </div>
      )}
      {preferences.additionalRequirements && (
        <div className="text-sm text-gray-600">
          Additional Requirements: {preferences.additionalRequirements}
        </div>
      )}
    </div>
  )
}