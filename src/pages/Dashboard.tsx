import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Menu, HelpCircle, Utensils, AlertTriangle, Globe, CreditCard } from 'lucide-react'
import { AnimatedGradientText } from '@/components/landing/AnimatedGradientText'
import { EmojiBackground } from '@/components/dashboard/EmojiBackground'
import { GenerateButton } from '@/components/dashboard/GenerateButton'
import { MealPlanCard } from '@/components/dashboard/MealPlanCard'

interface MealPlan {
  id: string // Changed from number to string
  title: string
  plan: string
  isMinimized: boolean
  recipeId?: string // Added to store the Supabase recipe ID
}

export default function Dashboard() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [mealPlanText, setMealPlanText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPlans, setGeneratedPlans] = useState<MealPlan[]>([])
  const [credits, setCredits] = useState(100)
  const [isNavOpen, setIsNavOpen] = useState(false)

  const triggerConfetti = () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 100
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    fire(0.2, {
      spread: 60,
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }

  const handleGenerate = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          preferences: profile?.preferences,
          additionalRequirements: mealPlanText,
        },
      })

      if (response.error) throw new Error('Failed to generate meal plan')

      const { data } = response
      setGeneratedPlans(prev => [...prev, {
        id: crypto.randomUUID(), // Using UUID instead of Date.now()
        title: data.mealPlan.plan_name,
        plan: data.recipes.map((recipe: any) => `
Recipe: ${recipe.title}

Ingredients:
${recipe.ingredients.join('\n')}

Instructions:
${recipe.instructions}
        `).join('\n\n'),
        isMinimized: false,
        recipeId: data.mealPlan.id // Store the Supabase recipe ID
      }])

      triggerConfetti()
      toast({
        title: "Success!",
        description: "Your meal plan has been generated.",
      })
    } catch (error) {
      console.error('Generation error:', error)
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [mealPlanText, profile?.preferences, isLoading, toast])

  const toggleMinimize = (id: string) => {
    setGeneratedPlans(prev =>
      prev.map(plan =>
        plan.id === id ? { ...plan, isMinimized: !plan.isMinimized } : plan
      )
    )
  }

  const closePlan = (id: string) => {
    setGeneratedPlans(prev => prev.filter(plan => plan.id !== id))
  }

  const savePlan = async (id: string) => {
    const planToSave = generatedPlans.find(plan => plan.id === id)
    if (!planToSave || !planToSave.recipeId) return

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: profile?.id,
          recipe_id: planToSave.recipeId, // Using the Supabase recipe ID
        })

      if (error) throw error

      toast({
        title: "Saved!",
        description: "Meal plan has been saved to your favorites.",
      })
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: "Error",
        description: "Failed to save meal plan. Please try again.",
        variant: "destructive",
      })
    }
  }

  const regeneratePlan = (id: string) => {
    handleGenerate()
    closePlan(id)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden">
      <EmojiBackground />
      
      <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-sm relative z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <AnimatedGradientText text="MealPrepGenie" className="text-2xl font-bold" />
          </div>
          <button 
            onClick={() => setIsNavOpen(true)} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white bg-opacity-90 backdrop-blur-md">
          <SheetHeader>
            <SheetTitle>
              <AnimatedGradientText text="Navigation" className="text-2xl font-semibold" />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <Button variant="ghost" className="w-full justify-start text-lg text-gray-600 hover:text-gray-900">
                  Dashboard
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start text-lg text-gray-600 hover:text-gray-900">
                  Meal Plans
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start text-lg text-gray-600 hover:text-gray-900">
                  Profile
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start text-lg text-gray-600 hover:text-gray-900">
                  Settings
                </Button>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      <main className="flex-grow flex items-center justify-center relative z-10">
        <motion.div
          className="bg-white bg-opacity-30 backdrop-blur-lg rounded-3xl shadow-lg p-6 max-w-md w-full mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatedGradientText text="Generate Meal Plan" className="text-2xl font-semibold mb-4 text-center block" />
          <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} className="space-y-4">
            <div className="relative">
              <Label htmlFor="mealPlanText" className="flex items-center text-gray-700">
                Additional Requirements
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-2">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    className="w-80 p-6 bg-white bg-opacity-95 backdrop-blur-md max-h-[80vh] overflow-y-auto" 
                    align="end" 
                    sideOffset={5}
                  >
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-900">Your Preferences</h3>
                      <div className="grid gap-3">
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm text-gray-700 flex items-center">
                            <Utensils className="w-4 h-4 mr-2" />
                            Diet Type
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                            {profile?.preferences?.diet || "Not set"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm text-gray-700 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Allergies
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                            {profile?.preferences?.allergies?.join(", ") || "None"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm text-gray-700 flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            Favorite Cuisines
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                            {profile?.preferences?.cuisines?.join(", ") || "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </Label>
              <Textarea
                id="mealPlanText"
                placeholder="Enter any specific requirements for your meal plan..."
                value={mealPlanText}
                onChange={(e) => setMealPlanText(e.target.value)}
                className="mt-2 h-20 resize-none bg-white bg-opacity-50 backdrop-blur-sm border-gray-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition duration-200"
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <GenerateButton onClick={handleGenerate} isLoading={isLoading} />
              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
                  >
                    Adjust Parameters
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white bg-opacity-90 backdrop-blur-md">
                  <DialogHeader>
                    <DialogTitle>
                      <AnimatedGradientText text="Adjust Meal Plan Parameters" className="text-2xl font-semibold" />
                    </DialogTitle>
                    <DialogDescription>
                      Fine-tune your meal plan generation settings here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <Label htmlFor="numMeals">Meals per Day</Label>
                        <Input
                          id="numMeals"
                          type="number"
                          min="1"
                          max="6"
                          value={profile?.preferences?.mealsPerDay || 3}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="numDays">Number of Days</Label>
                        <Input
                          id="numDays"
                          type="number"
                          min="1"
                          max="30"
                          value={7}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="caloricTarget">Daily Caloric Target</Label>
                      <div className="relative mt-2">
                        <Slider
                          id="caloricTarget"
                          min={1000}
                          max={4000}
                          step={50}
                          value={[2000]}
                          className="z-10 relative"
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-500 rounded-md opacity-50" 
                          style={{ filter: 'blur(4px)' }} 
                        />
                      </div>
                      <div className="text-center mt-1">2000 calories</div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </motion.div>
      </main>

      <AnimatePresence>
        {generatedPlans.map((plan) => (
          <MealPlanCard
            key={plan.id}
            plan={plan}
            onToggleMinimize={toggleMinimize}
            onClose={closePlan}
            onSave={savePlan}
            onRegenerate={regeneratePlan}
          />
        ))}
      </AnimatePresence>

      <footer className="bg-white bg-opacity-80 backdrop-blur-md shadow-sm mt-8 relative z-20">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          <p>Available Credits: {credits}</p>
          <Button variant="link" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Refill Credits <CreditCard className="inline w-4 h-4 ml-1" />
          </Button>
        </div>
      </footer>
    </div>
  )
}