import { motion } from 'framer-motion'
import { X, Minimize2, Maximize2, Save, RefreshCw, Star, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface MealPlan {
  id: string
  title: string
  plan: string
  isMinimized: boolean
  recipeId?: string
  isFavorited?: boolean
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

  return (
    <motion.div
      key={plan.id}
      initial={plan.isMinimized ? { opacity: 0, x: 20, y: 0 } : { opacity: 0, y: 20 }}
      animate={plan.isMinimized ? { opacity: 1, x: 0, y: 0 } : { opacity: 1, y: 0 }}
      exit={plan.isMinimized ? { opacity: 0, x: 20, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed ${
        plan.isMinimized
          ? 'bottom-4 left-4 w-64'
          : 'bottom-20 left-1/2 transform -translate-x-1/2 max-w-xl w-full mx-4'
      } bg-gradient-to-br from-white via-white to-gray-50 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 p-6 z-30`}
      style={{ pointerEvents: 'auto' }}
      layout
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
          {plan.title}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleMinimize(plan.id)}
            className="hover:bg-gray-100"
            aria-label={plan.isMinimized ? "Maximize" : "Minimize"}
          >
            {plan.isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
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
      {!plan.isMinimized && (
        <>
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 p-4 mb-4 max-h-[60vh] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {plan.plan}
            </pre>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(plan.id)}
              className="hover:bg-red-50 text-red-500"
              aria-label="Delete plan"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSave(plan.id)}
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
              onClick={() => onRegenerate(plan.id)}
              className="text-blue-600 hover:bg-blue-50"
              aria-label="Regenerate plan"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}
    </motion.div>
  )
}