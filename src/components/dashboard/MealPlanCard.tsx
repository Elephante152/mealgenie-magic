import { motion } from 'framer-motion'
import { X, Save, RefreshCw, Star, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  onClose,
  onSave,
  onRegenerate,
  onDelete
}: MealPlanCardProps) => {
  const { toast } = useToast()

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
        </DialogHeader>
        <ScrollArea className="p-6 pt-2 max-h-[80vh]">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {plan.plan}
            </pre>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}