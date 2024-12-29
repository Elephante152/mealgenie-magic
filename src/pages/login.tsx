import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if user profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            throw profileError;
          }

          if (profile) {
            // Check if user has completed onboarding
            const hasCompletedOnboarding = 
              profile.preferences?.diet &&
              Array.isArray(profile.preferences?.cuisines) &&
              Array.isArray(profile.preferences?.allergies);

            if (hasCompletedOnboarding) {
              navigate("/dashboard");
            } else {
              navigate("/onboarding");
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast({
          title: "Error",
          description: "There was a problem checking your session. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          // Wait a moment to ensure the profile trigger has completed
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            throw profileError;
          }

          if (profile) {
            toast({
              title: "Welcome!",
              description: `Signed in as ${session.user.email}`,
            });

            // Check if user has completed onboarding
            const hasCompletedOnboarding = 
              profile.preferences?.diet &&
              Array.isArray(profile.preferences?.cuisines) &&
              Array.isArray(profile.preferences?.allergies);

            if (hasCompletedOnboarding) {
              navigate("/dashboard");
            } else {
              navigate("/onboarding");
            }
          }
        } catch (error) {
          console.error("Error during sign in:", error);
          toast({
            title: "Error",
            description: "There was a problem signing you in. Please try again.",
            variant: "destructive",
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-medium text-primary hover:text-primary/90"
            >
              create a new account
            </button>
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#10B981',
                  brandAccent: '#059669',
                },
              },
            },
            className: {
              container: 'space-y-4',
              button: 'w-full px-4 py-2 rounded',
              divider: 'my-4',
            },
          }}
          providers={["google"]}
          redirectTo={`${window.location.origin}/dashboard`}
          onlyThirdPartyProviders={true}
        />
      </Card>
    </div>
  );
}