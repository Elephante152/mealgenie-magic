import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import MealPlans from "@/pages/MealPlans";
import Onboarding from "@/components/Onboarding";
import { AuthGuard } from "@/components/AuthGuard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
        <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/meal-plans" element={<AuthGuard><MealPlans /></AuthGuard>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;