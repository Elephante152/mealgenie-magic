import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { preferences, additionalRequirements } = await req.json()
    
    const prompt = `Create a detailed meal plan based on these preferences:
    - Diet: ${preferences.diet}
    - Cuisines: ${preferences.cuisines.join(', ')}
    - Allergies to avoid: ${preferences.allergies.join(', ')}
    - Activity Level: ${preferences.activityLevel}
    - Daily Calorie Target: ${preferences.calorieIntake}
    - Meals per Day: ${preferences.mealsPerDay}
    - Available Cooking Tools: ${preferences.cookingTools.join(', ')}
    
    Additional Requirements: ${additionalRequirements}
    
    Format the response as a JSON object with this structure:
    {
      "title": "Name of the meal plan",
      "meals": [
        {
          "name": "Meal name",
          "ingredients": ["ingredient1", "amount1", "ingredient2", "amount2"],
          "instructions": "Step by step instructions",
          "nutritionalInfo": {
            "calories": number,
            "protein": "Xg",
            "carbs": "Xg",
            "fats": "Xg"
          }
        }
      ]
    }`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and chef. Generate meal plans that are detailed, healthy, and follow the user\'s preferences exactly.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    const data = await response.json()
    const mealPlan = JSON.parse(data.choices[0].message.content)

    // Create recipe entries in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const recipes = await Promise.all(mealPlan.meals.map(async (meal) => {
      const { data: recipe, error } = await supabase
        .from('recipes')
        .insert({
          title: meal.name,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          is_public: false,
        })
        .select()
        .single()

      if (error) throw error
      return recipe
    }))

    // Create meal plan entry
    const { data: createdPlan, error: planError } = await supabase
      .from('meal_plans')
      .insert({
        plan_name: mealPlan.title,
        recipes: recipes.map(r => r.id),
      })
      .select()
      .single()

    if (planError) throw planError

    return new Response(
      JSON.stringify({ mealPlan: createdPlan, recipes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})