import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TicketsProvider } from "./contexts/TicketsContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Tickets from "./pages/Tickets";
import Incidents from "./pages/Incidents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TicketsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard/*"
            element={
              <div className="min-h-screen flex flex-col w-full bg-background">
                <DashboardHeader />
                <main className="flex-1 p-6">
                  <div className="max-w-7xl mx-auto">
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="tickets" element={<Tickets />} />
                      <Route path="incidents" element={<Incidents />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </main>
                <ChatbotWidget />
              </div>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TicketsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
