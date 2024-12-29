import { motion } from 'framer-motion'
import { Utensils } from 'lucide-react'

interface GenerateButtonProps {
  onClick: () => void
  isLoading: boolean
}

export const GenerateButton = ({ onClick, isLoading }: GenerateButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-4 rounded-full shadow-lg bg-white"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isLoading ? { rotate: 360 } : {}}
      transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
    >
      <Utensils className={`w-6 h-6 text-emerald-500 ${isLoading ? 'animate-pulse' : ''}`} />
    </motion.button>
  )
}