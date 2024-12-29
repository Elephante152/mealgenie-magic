import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
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
import { useAuth } from "@/hooks/useAuth"
import { Menu, HelpCircle, Settings, CreditCard, Wand2, X, Minimize2, Maximize2, Save, RefreshCw, Utensils, AlertTriangle, Globe, Activity, BarChart, Coffee } from 'lucide-react'
import { AnimatedGradientText } from '@/components/landing/AnimatedGradientText'

interface UserPreferences {
  dietType: string
  allergies: string
  favoriteCuisines: string[]
  activityLevel: string
  calorieIntake: number
  mealsPerDay: number
  cookingTools: string[]
}

interface MealPlan {
  id: number
  title: string
  plan: string
  isMinimized: boolean
}

const EmojiBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{
            top: "-20%",
            left: `${Math.random() * 100}%`,
            rotate: Math.random() * 360,
          }}
          animate={{
            top: "120%",
            rotate: Math.random() * 360 + 360,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {['🥗', '🍽️', '🥘', '🍳', '🥑', '🍆', '🥕'][Math.floor(Math.random() * 7)]}
        </motion.div>
      ))}
    </div>
  )
}

const GenerateButton = ({ onClick, isLoading }: { onClick: () => void, isLoading: boolean }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-4 rounded-full shadow-lg bg-white"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isLoading ? { rotate: 360 } : {}}
      transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
    >
      <Wand2 className={`w-6 h-6 text-emerald-500 ${isLoading ? 'animate-pulse' : ''}`} />
    </motion.button>
  )
}

const generateMealPlanTitle = (requirements: string) => {
  const keywords = requirements.toLowerCase().split(' ')
  const dietTypes = ['vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean']
  const foundDiet = dietTypes.find(diet => keywords.includes(diet)) || 'Custom'
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${foundDiet} Meal Plan (${timestamp})`
}

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })
}

export default function Dashboard() {
  const { profile } = useAuth()
  const [mealPlanText, setMealPlanText] = useState('')
  const [numMeals, setNumMeals] = useState(profile?.preferences?.mealsPerDay || 3)
  const [numDays, setNumDays] = useState(7)
  const [caloricTarget, setCaloricTarget] = useState(profile?.preferences?.calorieIntake || 2000)
  const [generatedPlans, setGeneratedPlans] = useState<MealPlan[]>([])
  const [credits, setCredits] = useState(100)
  const [isLoading, setIsLoading] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

  const handleGenerate = useCallback(() => {
    if (credits <= 0) {
      console.log('No credits available')
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const title = generateMealPlanTitle(mealPlanText)
      const newPlan: MealPlan = {
        id: Date.now(),
        title,
        plan: `Generated meal plan based on your preferences and additional requirements: ${mealPlanText}

[Your generated meal plan would appear here]`,
        isMinimized: false
      }
      setGeneratedPlans(prev => [...prev, newPlan])
      setCredits(prev => prev - 1)
      setIsLoading(false)
      triggerConfetti()
    }, 2000)
  }, [mealPlanText, credits])

  const toggleMinimize = (id: number) => {
    setGeneratedPlans(prev =>
      prev.map(plan =>
        plan.id === id ? { ...plan, isMinimized: !plan.isMinimized } : plan
      )
    )
  }

  const closePlan = (id: number) => {
    setGeneratedPlans(prev => prev.filter(plan => plan.id !== id))
  }

  const savePlan = (id: number) => {
    // Implement save functionality
    console.log('Saving plan:', id)
  }

  const regeneratePlan = (id: number) => {
    if (credits <= 0) {
      console.log('No credits available')
      return
    }
    
    // Implement regenerate functionality
    console.log('Regenerating plan:', id)
    setCredits(prev => prev - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoading && credits > 0) {
      handleGenerate()
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
                            {profile?.preferences?.dietType || "Not set"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm text-gray-700 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Allergies
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                            {profile?.preferences?.allergies || "None"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm text-gray-700 flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            Favorite Cuisines
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                            {profile?.preferences?.favoriteCuisines?.join(", ") || "Not set"}
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
                          value={numMeals}
                          onChange={(e) => setNumMeals(parseInt(e.target.value))}
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
                          value={numDays}
                          onChange={(e) => setNumDays(parseInt(e.target.value))}
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
                          value={[caloricTarget]}
                          onValueChange={(value) => setCaloricTarget(value[0])}
                          className="z-10 relative"
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-500 rounded-md opacity-50" 
                          style={{ filter: 'blur(4px)' }} 
                        />
                      </div>
                      <div className="text-center mt-1">{caloricTarget} calories</div>
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
                  onClick={() => toggleMinimize(plan.id)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={plan.isMinimized ? "Maximize" : "Minimize"}
                >
                  {plan.isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => closePlan(plan.id)}
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
                    onClick={() => savePlan(plan.id)}
                    className="text-emerald-600 hover:text-emerald-700"
                    aria-label="Save plan"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => regeneratePlan(plan.id)}
                    className="text-blue-600 hover:text-blue-700"
                    aria-label="Regenerate plan"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
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
