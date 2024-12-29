import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, RefreshCw, Star, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from 'react'
import { MealPlanContent } from './MealPlanContent'
import { MealPlanPreferencesDisplay } from './MealPlanPreferences'
import type { MealPlan } from '@/types/user'

interface MealPlanCardProps {
  plan: MealPlan;
  onToggleMinimize: (id: string) => void;
  onClose: (id: string) => void;
  onSave: (id: string) => void;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
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

  if (!plan) {
    return null;
  }

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
          {plan.preferences && <MealPlanPreferencesDisplay preferences={plan.preferences} />}
        </DialogHeader>
        <MealPlanContent content={plan.plan} />
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