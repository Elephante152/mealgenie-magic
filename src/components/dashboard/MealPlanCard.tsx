import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, RefreshCw, Star, Trash2, Calendar, Clock, Target } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"

interface MealPlan {
  id: string
  title: string
  plan: string
  isMinimized: boolean
  recipeId?: string
  isFavorited?: boolean
  preferences?: {
    diet?: string
    allergies?: string[]
    cuisines?: string[]
    additionalRequirements?: string
    parameters?: {
      mealsPerDay?: number
      numDays?: number
      caloricTarget?: number
    }
  }
}

interface MealPlanCardProps {
  plan: MealPlan
  onToggleMinimize: (id: string) => void
  onClose: (id: string) => void
  onSave: (id: string) => void
  onRegenerate: (id: string) => void
  onDelete: (id: string) => void
}

export const MealPlanCard = ({
  plan,
  onToggleMinimize,
  onClose,
  onSave,
  onRegenerate,
  onDelete
}: MealPlanCardProps) => {
  const { toast } = useToast()
  const [showSuccess, setShowSuccess] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleRegenerate = async (id: string) => {
    setIsRegenerating(true)
    try {
      await onRegenerate(id)
      toast({
        title: "Regenerating meal plan",
        description: "Your meal plan is being updated with new recipes.",
      })
    } catch (error) {
      toast({
        title: "Error regenerating meal plan",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id)
      toast({
        title: "Meal plan deleted",
        description: "Your meal plan has been removed.",
      })
    } catch (error) {
      toast({
        title: "Error deleting meal plan",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (id: string) => {
    try {
      await onSave(id)
      toast({
        title: plan.isFavorited ? "Removed from favorites" : "Added to favorites",
        description: plan.isFavorited 
          ? "The meal plan has been removed from your favorites."
          : "The meal plan has been added to your favorites.",
      })
    } catch (error) {
      toast({
        title: "Error updating favorites",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  // Format the plan content for better readability
  const formatPlanContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('Day')) {
        return (
          <div key={index} className="mt-6 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{line}</h3>
          </div>
        )
      } else if (line.includes('Breakfast:') || line.includes('Lunch:') || line.includes('Dinner:')) {
        return (
          <div key={index} className="mt-4 mb-2">
            <h4 className="text-md font-medium text-gray-700">{line}</h4>
          </div>
        )
      } else if (line.trim().startsWith('-')) {
        return (
          <div key={index} className="ml-4 text-gray-600">
            {line}
          </div>
        )
      }
      return <div key={index}>{line}</div>
    })
  }

  return (
    <Dialog defaultOpen={true} onOpenChange={() => onClose(plan.id)}>
      <DialogContent className="max-w-4xl w-[calc(100%-2rem)] p-0 gap-0 bg-white/95 backdrop-blur-md">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              {plan.title}
            </DialogTitle>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(plan.id)}
                className="hover:bg-red-50 text-red-500"
                aria-label="Delete plan"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSave(plan.id)}
                className={`${
                  plan.isFavorited 
                    ? 'text-yellow-500 hover:bg-yellow-50' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
                aria-label={plan.isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className="w-5 h-5" fill={plan.isFavorited ? "currentColor" : "none"} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRegenerate(plan.id)}
                className="text-blue-600 hover:bg-blue-50"
                disabled={isRegenerating}
                aria-label="Regenerate plan"
              >
                <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onClose(plan.id)}
                className="hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DialogDescription className="mt-2">
            Your personalized meal plan based on your preferences
          </DialogDescription>
          {plan.preferences && (
            <div className="mt-4 space-y-2">
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
              {plan.preferences.additionalRequirements && (
                <div className="text-sm text-gray-600">
                  Additional Requirements: {plan.preferences.additionalRequirements}
                </div>
              )}
            </div>
          )}
        </DialogHeader>
        <ScrollArea className="p-6 pt-2 max-h-[80vh]">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 p-6">
            <div className="space-y-1 text-sm text-gray-700 leading-relaxed">
              {formatPlanContent(plan.plan)}
            </div>
          </div>
        </ScrollArea>
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg"
            >
              <div className="text-center">
                <h3 className="font-semibold">Success!</h3>
                <p className="text-sm">Your meal plan has been generated.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}