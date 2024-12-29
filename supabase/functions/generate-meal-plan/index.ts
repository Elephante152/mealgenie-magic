import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const generateMealPlanWithAI = async (preferences: any, additionalRequirements: string) => {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Generating meal plan with preferences:', preferences);
  console.log('Additional requirements:', additionalRequirements);

  const openai = new OpenAI({
    apiKey: openAIApiKey,
  });

  const systemPrompt = `You are a professional nutritionist and meal planner. Create a detailed meal plan that follows these guidelines:
- Consider dietary restrictions: ${preferences?.diet || 'None'}
- Avoid allergens: ${preferences?.allergies?.join(', ') || 'None'}
- Preferred cuisines: ${preferences?.cuisines?.join(', ') || 'Any'}
- Meals per day: ${preferences?.parameters?.mealsPerDay || 3}
- Days in plan: ${preferences?.parameters?.numDays || 7}
- Target calories per day: ${preferences?.parameters?.caloricTarget || 2000}
${additionalRequirements ? `Additional requirements: ${additionalRequirements}` : ''}

For each meal, provide:
1. Recipe name
2. List of ingredients with quantities
3. Step-by-step cooking instructions
4. Approximate calories`;

  try {
    console.log('Sending request to OpenAI with system prompt:', systemPrompt);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate a meal plan based on the above preferences." }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;
    console.log('OpenAI response:', response);
    
    let mealPlanContent;
    try {
      mealPlanContent = JSON.parse(response);
      console.log('Successfully parsed meal plan:', mealPlanContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw response content:', response);
      throw new Error('Failed to parse meal plan response');
    }
    
    return mealPlanContent;
  } catch (error) {
    console.error('Error generating meal plan with OpenAI:', error);
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the user's JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error('User verification error:', userError);
      throw new Error('Invalid user token');
    }

    console.log('User verified:', user.id);

    // Parse the request body
    const { preferences, additionalRequirements, ingredientImageUrl } = await req.json();
    console.log('Received request with preferences:', preferences);
    console.log('Additional requirements:', additionalRequirements);
    console.log('Ingredient image URL:', ingredientImageUrl);

    // Generate meal plan using OpenAI
    const mealPlan = await generateMealPlanWithAI(preferences, additionalRequirements);

    // Store recipes in Supabase
    const recipes = await Promise.all(mealPlan.recipes.map(async (recipe: any) => {
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          is_public: false,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing recipe:', error);
        throw error;
      }
      return data;
    }));

    // Create meal plan entry
    const { data: storedMealPlan, error: planError } = await supabase
      .from('meal_plans')
      .insert({
        plan_name: mealPlan.plan_name,
        recipes: recipes.map(r => r.id),
        user_id: user.id
      })
      .select()
      .single();

    if (planError) {
      console.error('Error storing meal plan:', planError);
      throw planError;
    }

    return new Response(
      JSON.stringify({ mealPlan: storedMealPlan, recipes: mealPlan.recipes }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in generate-meal-plan function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});