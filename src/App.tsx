import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "@/pages/Index";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/Dashboard";
import MealPlans from "@/pages/MealPlans";
import Profile from "@/pages/Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/meal-plans"
            element={
              <AuthGuard>
                <MealPlans />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;