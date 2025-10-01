import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * Ticket Context - Global state management for tickets and incidents
 * Provides synchronization between chat window and dashboard
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
  updated: string;
  category: string;
  chatHistory: ChatMessage[];
  comments?: Array<{ author: string; content: string; timestamp: string }>;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
  updated: string;
  category: string;
  chatHistory: ChatMessage[];
  timeline: Array<{ status: string; timestamp: string; description: string }>;
  relatedSR?: string;
}

interface TicketsContextType {
  tickets: Ticket[];
  incidents: Incident[];
  addTicket: (ticket: Ticket) => void;
  addIncident: (incident: Incident) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  getTicketById: (id: string) => Ticket | undefined;
  getIncidentById: (id: string) => Incident | undefined;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketsProvider");
  }
  return context;
};

export const TicketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const addTicket = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  const addIncident = (incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === id ? { ...ticket, ...updates } : ticket))
    );
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents((prev) =>
      prev.map((incident) => (incident.id === id ? { ...incident, ...updates } : incident))
    );
  };

  const getTicketById = (id: string) => {
    return tickets.find((ticket) => ticket.id === id);
  };

  const getIncidentById = (id: string) => {
    return incidents.find((incident) => incident.id === id);
  };

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        incidents,
        addTicket,
        addIncident,
        updateTicket,
        updateIncident,
        getTicketById,
        getIncidentById,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};
