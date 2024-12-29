import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock data generator function
const generateMockMealPlan = (preferences: any, additionalRequirements: string) => {
  console.log('Generating mock meal plan with preferences:', preferences);
  console.log('Additional requirements:', additionalRequirements);
  
  // Mock recipe data
  const mockRecipes = [
    {
      title: "Healthy Grilled Chicken Salad",
      ingredients: [
        "2 chicken breasts",
        "200g mixed salad greens",
        "100g cherry tomatoes",
        "2 tbsp olive oil",
        "1 tbsp balsamic vinegar"
      ],
      instructions: "1. Season chicken breasts with salt and pepper\n2. Grill for 6-8 minutes per side\n3. Let rest for 5 minutes, then slice\n4. Mix greens and tomatoes\n5. Top with chicken\n6. Drizzle with oil and vinegar"
    },
    {
      title: "Quinoa Buddha Bowl",
      ingredients: [
        "1 cup quinoa",
        "1 can chickpeas",
        "1 sweet potato",
        "2 cups kale",
        "2 tbsp tahini"
      ],
      instructions: "1. Cook quinoa according to package instructions\n2. Roast chickpeas and diced sweet potato\n3. Massage kale with olive oil\n4. Assemble bowl with quinoa base\n5. Top with roasted vegetables and drizzle tahini"
    }
  ];

  return {
    plan_name: `Custom ${preferences?.diet || 'Balanced'} Meal Plan`,
    recipes: mockRecipes
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences, additionalRequirements } = await req.json();
    console.log('Received request with preferences:', preferences);
    console.log('Additional requirements:', additionalRequirements);

    // Create Supabase client using environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate mock meal plan
    const mockPlan = generateMockMealPlan(preferences, additionalRequirements);

    // Store recipes in Supabase
    const recipes = await Promise.all(mockPlan.recipes.map(async (recipe) => {
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          is_public: false,
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
    const { data: mealPlan, error: planError } = await supabase
      .from('meal_plans')
      .insert({
        plan_name: mockPlan.plan_name,
        recipes: recipes.map(r => r.id),
      })
      .select()
      .single();

    if (planError) {
      console.error('Error storing meal plan:', planError);
      throw planError;
    }

    return new Response(
      JSON.stringify({ mealPlan, recipes: mockPlan.recipes }),
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