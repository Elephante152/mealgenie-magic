import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN") {
      if (!session?.user?.email_confirmed_at) {
        toast({
          title: "Please verify your email",
          description: "Check your inbox for a verification link.",
        });
        return;
      }

      try {
        // Check if user has completed onboarding by checking their preferences
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        // If user has preferences set (completed onboarding), redirect to dashboard
        // Otherwise, send them to onboarding
        if (profile?.preferences?.diet) {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Welcome!",
            description: "Let's set up your preferences.",
          });
          navigate("/onboarding");
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        toast({
          title: "Error",
          description: "There was a problem logging you in. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

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
          redirectTo={`${window.location.origin}/onboarding`}
          onlyThirdPartyProviders={false}
        />
      </Card>
    </div>
  );
}
