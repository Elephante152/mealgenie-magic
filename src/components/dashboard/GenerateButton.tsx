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
            className="px-4 py-2 rounded-md shadow-lg bg-gradient-to-br from-[#9b87f5] via-[#7E69AB] to-[#6E59A5] text-white relative group hover:shadow-purple-200/50 transition-shadow duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={isLoading ? { rotate: 360 } : {}}
            transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
          >
            <Utensils className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
            <span className="font-medium">Generate Plan</span>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Click to generate your personalized meal plan</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}