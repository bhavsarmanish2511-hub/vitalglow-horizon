import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TicketsProvider } from "./contexts/TicketsContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SupportDashboard from "./pages/SupportDashboard";
import Reports from "./pages/Reports";
import Tickets from "./pages/Tickets";
import Incidents from "./pages/Incidents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { AIAgentWidget } from "@/components/support/AIAgentWidget";
import { handleNotificationClickHelper } from "./pages/Dashboard";
import { useState } from "react";

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Dashboard wrapper with notification handler
function DashboardWrapper() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <DashboardHeader 
        onNotificationClick={(ticketId) => {
          // This will be handled by Dashboard component's effect
          window.dispatchEvent(new CustomEvent('notification-clicked', { detail: ticketId }));
        }} 
      />
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
  );
}

// Support Dashboard wrapper with notification handler
function SupportDashboardWrapper() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <DashboardHeader 
        onNotificationClick={(ticketId) => {
          // This will be handled by SupportDashboard component's effect
          window.dispatchEvent(new CustomEvent('notification-clicked', { detail: ticketId }));
        }} 
      />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <SupportDashboard />
        </div>
      </main>
      <AIAgentWidget />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TicketsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Business User Dashboard */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardWrapper />
                  </ProtectedRoute>
                }
              />
              
              {/* Support Engineer Dashboard */}
              <Route
                path="/support-dashboard"
                element={
                  <ProtectedRoute>
                    <SupportDashboardWrapper />
                  </ProtectedRoute>
                }
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TicketsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
