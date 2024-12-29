import { motion } from 'framer-motion'
import { Utensils } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GenerateButtonProps {
  onClick: () => void
  isLoading: boolean
}

export const GenerateButton = ({ onClick, isLoading }: GenerateButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={onClick}
            className="p-6 rounded-full shadow-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-white relative group hover:shadow-emerald-200/50 transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isLoading ? { rotate: 360 } : {}}
            transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
          >
            <Utensils className={`w-8 h-8 ${isLoading ? 'animate-pulse' : ''}`} />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-sm text-gray-600">
              Generate Plan
            </div>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to generate your meal plan</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}