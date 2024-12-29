import { motion } from 'framer-motion'
import { X, Minimize2, Maximize2, Save, RefreshCw } from 'lucide-react'

interface MealPlan {
  id: string // Changed from number to string
  title: string
  plan: string
  isMinimized: boolean
  recipeId?: string // Added to store the Supabase recipe ID
}

interface MealPlanCardProps {
  plan: MealPlan
  onToggleMinimize: (id: string) => void // Updated to use string
  onClose: (id: string) => void // Updated to use string
  onSave: (id: string) => void // Updated to use string
  onRegenerate: (id: string) => void // Updated to use string
}

export const MealPlanCard = ({
  plan,
  onToggleMinimize,
  onClose,
  onSave,
  onRegenerate
}: MealPlanCardProps) => {
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
      } bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg p-6 z-30`}
      layout
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{plan.title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => onToggleMinimize(plan.id)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={plan.isMinimized ? "Maximize" : "Minimize"}
          >
            {plan.isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => onClose(plan.id)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {!plan.isMinimized && (
        <>
          <pre className="whitespace-pre-wrap bg-gray-100 bg-opacity-50 p-4 rounded-md text-sm text-gray-700 mb-4">
            {plan.plan}
          </pre>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => onSave(plan.id)}
              className="text-emerald-600 hover:text-emerald-700"
              aria-label="Save plan"
            >
              <Save className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onRegenerate(plan.id)}
              className="text-blue-600 hover:text-blue-700"
              aria-label="Regenerate plan"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  )
}