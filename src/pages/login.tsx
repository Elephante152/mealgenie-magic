import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { hasCompletedPreferences } from "@/utils/preferences";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
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
            const hasCompletedOnboarding = hasCompletedPreferences(profile.preferences);
            
            // For login, check if onboarding is completed
            if (hasCompletedOnboarding) {
              navigate("/dashboard");
            } else {
              navigate("/onboarding");
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setError("There was a problem checking your session. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

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
            const hasCompletedOnboarding = hasCompletedPreferences(profile.preferences);
            
            toast({
              title: "Welcome back!",
              description: "You have successfully signed in.",
            });

            // For login, check if onboarding is completed
            if (hasCompletedOnboarding) {
              navigate("/dashboard");
            } else {
              navigate("/onboarding");
            }
          }
        } catch (error) {
          console.error("Error during login:", error);
          setError("There was a problem signing in. Please try again.");
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
      <Card className="w-full max-w-md p-6 space-y-6 bg-white relative">
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

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
          view="sign_in"
          providers={["google"]}
          redirectTo={`${window.location.origin}/dashboard`}
          onlyThirdPartyProviders={true}
        />
      </Card>
    </div>
  );
}