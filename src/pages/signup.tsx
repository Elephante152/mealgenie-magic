import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth event:", event);
    if (event === "SIGNED_IN") {
      setLoading(true);
      try {
        // Check if the user's email is verified
        if (session?.user?.email_confirmed_at) {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
          navigate("/onboarding");
        } else {
          toast({
            title: "Please verify your email",
            description: "Check your inbox for a verification link.",
          });
        }
      } catch (error) {
        console.error("Error during signup:", error);
        setError("An unexpected error occurred during signup.");
      } finally {
        setLoading(false);
      }
    } else if (event === "SIGNED_OUT") {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-primary hover:text-primary/90"
            >
              sign in to your account
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
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                },
              },
            },
            className: {
              container: 'space-y-4',
              button: 'w-full px-4 py-2 rounded',
              divider: 'my-4',
            },
          }}
          view="sign_up"
          providers={["google"]}
          redirectTo={`${window.location.origin}/onboarding`}
          localization={{
            variables: {
              sign_up: {
                email_label: "Email address",
                password_label: "Create a password",
                email_input_placeholder: "Enter your email",
                password_input_placeholder: "Create a secure password",
                button_label: "Create account",
                social_provider_text: "Continue with {{provider}}",
              },
            },
          }}
        />
      </Card>
    </div>
  );
}