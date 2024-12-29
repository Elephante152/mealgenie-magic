import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const mockMealPlans = [
  {
    plan_name: "Balanced Weekly Plan",
    recipes: [
      {
        title: "Mediterranean Breakfast Bowl",
        ingredients: [
          "2 eggs",
          "1 cup spinach",
          "1/2 avocado",
          "Cherry tomatoes",
          "Feta cheese",
          "Olive oil"
        ],
        instructions: "1. Sauté spinach in olive oil\n2. Poach eggs\n3. Assemble bowl with spinach, eggs, sliced avocado, tomatoes\n4. Top with crumbled feta"
      },
      {
        title: "Quinoa Power Lunch",
        ingredients: [
          "1 cup quinoa",
          "1 can chickpeas",
          "Mixed vegetables",
          "Lemon juice",
          "Olive oil",
          "Fresh herbs"
        ],
        instructions: "1. Cook quinoa according to package instructions\n2. Rinse and drain chickpeas\n3. Chop vegetables\n4. Mix all ingredients with lemon juice and olive oil\n5. Season with herbs"
      },
      {
        title: "Grilled Salmon Dinner",
        ingredients: [
          "Salmon fillet",
          "Asparagus",
          "Sweet potato",
          "Lemon",
          "Garlic",
          "Herbs"
        ],
        instructions: "1. Marinate salmon with lemon, garlic, and herbs\n2. Preheat grill\n3. Grill salmon for 4-5 minutes per side\n4. Roast asparagus and sweet potato\n5. Serve together"
      }
    ]
  },
  {
    plan_name: "Plant-Based Week",
    recipes: [
      {
        title: "Overnight Oats",
        ingredients: [
          "Rolled oats",
          "Almond milk",
          "Chia seeds",
          "Maple syrup",
          "Fresh berries",
          "Nuts"
        ],
        instructions: "1. Mix oats, almond milk, and chia seeds\n2. Add maple syrup to taste\n3. Refrigerate overnight\n4. Top with berries and nuts before serving"
      },
      {
        title: "Buddha Bowl",
        ingredients: [
          "Brown rice",
          "Roasted chickpeas",
          "Kale",
          "Sweet potato",
          "Tahini",
          "Seeds"
        ],
        instructions: "1. Cook brown rice\n2. Roast chickpeas and sweet potato\n3. Massage kale with olive oil\n4. Assemble bowl\n5. Drizzle with tahini sauce"
      }
    ]
  }
];

const generateMockMealPlan = (preferences: any) => {
  // Select a random meal plan from mock data
  const randomPlan = mockMealPlans[Math.floor(Math.random() * mockMealPlans.length)];
  
  // Customize the plan based on preferences
  if (preferences?.diet === 'vegetarian') {
    randomPlan.plan_name = "Vegetarian " + randomPlan.plan_name;
  }
  
  return randomPlan;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error('User verification error:', userError);
      throw new Error('Invalid user token');
    }

    console.log('User verified:', user.id);

    const { preferences, additionalRequirements } = await req.json();
    console.log('Received request with preferences:', preferences);
    console.log('Additional requirements:', additionalRequirements);

    const mealPlan = generateMockMealPlan(preferences);

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