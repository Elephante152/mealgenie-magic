import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { preferences, additionalRequirements } = await req.json()
    console.log('Received request with preferences:', preferences)
    console.log('Additional requirements:', additionalRequirements)
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create the prompt for meal plan generation
    const prompt = `Create a detailed meal plan based on these preferences:
    - Diet: ${preferences?.diet || 'Not specified'}
    - Cuisines: ${preferences?.cuisines?.join(', ') || 'Not specified'}
    - Allergies to avoid: ${preferences?.allergies?.join(', ') || 'None'}
    
    Additional Requirements: ${additionalRequirements || 'None'}
    
    Please provide a meal plan in this exact JSON format:
    {
      "plan_name": "Name of the meal plan",
      "meals": [
        {
          "title": "Meal name",
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

    console.log('Sending request to OpenAI')
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and chef. Generate meal plans that are detailed, healthy, and follow the user\'s preferences exactly. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const openAIData = await openAIResponse.json()
    console.log('Received response from OpenAI:', openAIData)

    if (!openAIData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI')
    }

    const mealPlan = JSON.parse(openAIData.choices[0].message.content)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Store recipes in Supabase
    const recipes = await Promise.all(mealPlan.meals.map(async (meal: any) => {
      const { data: recipe, error } = await supabase
        .from('recipes')
        .insert({
          title: meal.title,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          is_public: false,
        })
        .select()
        .single()

      if (error) {
        console.error('Error storing recipe:', error)
        throw error
      }
      return recipe
    }))

    // Create meal plan entry
    const { data: createdPlan, error: planError } = await supabase
      .from('meal_plans')
      .insert({
        plan_name: mealPlan.plan_name,
        recipes: recipes.map(r => r.id),
      })
      .select()
      .single()

    if (planError) {
      console.error('Error storing meal plan:', planError)
      throw planError
    }

    return new Response(
      JSON.stringify({ mealPlan: createdPlan, recipes }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in generate-meal-plan function:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})