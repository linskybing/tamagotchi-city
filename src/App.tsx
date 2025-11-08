import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/hooks/useUser";
import Index from "./pages/Index";
import Exercise from "./pages/Exercise";
import Travel from "./pages/Travel";
import Status from "./pages/Status";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { userId } = useUser();

  if (!userId) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
            <Route path="/travel" element={<ProtectedRoute><Travel /></ProtectedRoute>} />
            <Route path="/status" element={<ProtectedRoute><Status /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
