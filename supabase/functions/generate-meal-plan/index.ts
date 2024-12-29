import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock data generator function
const generateMockMealPlan = (preferences: any, additionalRequirements: string) => {
  console.log('Generating mock meal plan with preferences:', preferences);
  console.log('Additional requirements:', additionalRequirements);
  
  // Mock meal plan data
  return {
    plan_name: "7-Day Healthy Meal Plan",
    meals: [
      {
        title: "Grilled Chicken Salad",
        ingredients: [
          "chicken breast", "2",
          "mixed greens", "200g",
          "cherry tomatoes", "100g",
          "olive oil", "2 tbsp",
          "balsamic vinegar", "1 tbsp"
        ],
        instructions: "1. Season chicken breast\n2. Grill until cooked through\n3. Chop vegetables\n4. Mix with dressing\n5. Serve",
        nutritionalInfo: {
          calories: 350,
          protein: "30g",
          carbs: "15g",
          fats: "20g"
        }
      },
      {
        title: "Quinoa Buddha Bowl",
        ingredients: [
          "quinoa", "1 cup",
          "chickpeas", "1 can",
          "sweet potato", "1 medium",
          "kale", "2 cups",
          "tahini", "2 tbsp"
        ],
        instructions: "1. Cook quinoa\n2. Roast chickpeas and sweet potato\n3. Massage kale\n4. Assemble bowl\n5. Drizzle with tahini",
        nutritionalInfo: {
          calories: 450,
          protein: "15g",
          carbs: "65g",
          fats: "15g"
        }
      }
    ]
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

    // Generate mock meal plan
    const mealPlan = generateMockMealPlan(preferences, additionalRequirements);

    // Store mock recipes in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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
        .single();

      if (error) {
        console.error('Error storing recipe:', error);
        throw error;
      }
      return recipe;
    }));

    // Create meal plan entry
    const { data: createdPlan, error: planError } = await supabase
      .from('meal_plans')
      .insert({
        plan_name: mealPlan.plan_name,
        recipes: recipes.map(r => r.id),
      })
      .select()
      .single();

    if (planError) {
      console.error('Error storing meal plan:', planError);
      throw planError;
    }

    return new Response(
      JSON.stringify({ mealPlan: createdPlan, recipes }),
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
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
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