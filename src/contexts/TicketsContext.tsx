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
  createdBy: string;
  created: string;
  updated: string;
  category: string;
  chatHistory: ChatMessage[];
  timeline: Array<{ status: string; timestamp: string; description: string }>;
  relatedSR?: string;
  downloadLink?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  emailSent?: boolean;
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

// Mock closed tickets for initial state
const mockClosedTickets: Ticket[] = [
  {
    id: "SR12340",
    title: "Quarterly Sales Report Access",
    description: "Request for Q3 2024 sales data and analytics",
    status: "resolved",
    priority: "medium",
    assignee: "Data Analytics Team",
    created: "2024-01-10 08:00",
    updated: "2024-01-12 16:30",
    category: "Reports",
    comments: [
      { author: "AI Assistant", content: "Service request created successfully", timestamp: "2024-01-10 08:00" },
      { author: "Data Analytics Team", content: "Report generated and delivered", timestamp: "2024-01-12 16:30" }
    ],
    chatHistory: [
      { role: "user", content: "I need the Q3 sales report" },
      { role: "assistant", content: "I'll generate that report for you. Creating service request..." }
    ]
  },
  {
    id: "SR12338",
    title: "VPN Access Request",
    description: "Request for remote VPN access credentials",
    status: "completed",
    priority: "high",
    assignee: "IT Security Team",
    created: "2024-01-08 09:15",
    updated: "2024-01-09 14:45",
    category: "Access",
    comments: [
      { author: "AI Assistant", content: "Ticket routed to IT Security", timestamp: "2024-01-08 09:15" },
      { author: "IT Security Team", content: "VPN credentials provided via secure channel", timestamp: "2024-01-09 14:45" }
    ],
    chatHistory: [
      { role: "user", content: "I need VPN access to work remotely" },
      { role: "assistant", content: "I'll create a request for VPN access and route it to IT Security." }
    ]
  },
  {
    id: "SR12335",
    title: "Monthly Expense Reconciliation",
    description: "Reconciliation of December 2024 expense reports",
    status: "resolved",
    priority: "medium",
    assignee: "Finance Team",
    created: "2024-01-05 10:30",
    updated: "2024-01-07 17:20",
    category: "Finance",
    comments: [
      { author: "AI Assistant", content: "Service request created", timestamp: "2024-01-05 10:30" },
      { author: "Finance Team", content: "Reconciliation completed, no discrepancies found", timestamp: "2024-01-07 17:20" }
    ],
    chatHistory: [
      { role: "user", content: "Can you help reconcile my December expenses?" },
      { role: "assistant", content: "I'll create a reconciliation request for the Finance Team." }
    ]
  }
];

const mockClosedIncidents: Incident[] = [
  {
    id: "INC56786",
    title: "Sensitive Financial Data Access",
    description: "Incident for accessing confidential Q3 financial statements",
    status: "resolved",
    priority: "critical",
    assignee: "andrews@intelletica.com",
    createdBy: "james@fincompany.com",
    created: "2024-01-08 11:00",
    updated: "2024-01-10 15:30",
    category: "Security",
    chatHistory: [
      { role: "user", content: "I need the confidential Q3 financial statements" },
      { role: "assistant", content: "As this involves sensitive financial data, I'm creating an incident for approval." }
    ],
    timeline: [
      { status: "Created", timestamp: "2024-01-08 11:00", description: "Incident created by AI Assistant" },
      { status: "Pending Approval", timestamp: "2024-01-08 11:05", description: "Routed to Finance Manager" },
      { status: "Approved", timestamp: "2024-01-08 14:20", description: "Approved by andrews@intelletica.com" },
      { status: "Resolved", timestamp: "2024-01-10 15:30", description: "Access granted and documents provided" }
    ],
    relatedSR: "SR12339"
  },
  {
    id: "INC56785",
    title: "Employee SSN Data Request",
    description: "Incident for accessing employee Social Security Numbers for tax filing",
    status: "closed",
    priority: "critical",
    assignee: "hr@intelletica.com",
    createdBy: "james@fincompany.com",
    created: "2024-01-03 09:00",
    updated: "2024-01-05 16:00",
    category: "HR Security",
    chatHistory: [
      { role: "user", content: "I need employee SSN data for annual tax reporting" },
      { role: "assistant", content: "This involves highly sensitive PII data. Creating a security incident for proper authorization." }
    ],
    timeline: [
      { status: "Created", timestamp: "2024-01-03 09:00", description: "Security incident created" },
      { status: "Escalated", timestamp: "2024-01-03 09:15", description: "Escalated to HR Director" },
      { status: "Approved", timestamp: "2024-01-04 10:00", description: "Approved with MFA verification required" },
      { status: "Closed", timestamp: "2024-01-05 16:00", description: "Data provided via secure encrypted channel" }
    ],
    relatedSR: "SR12336"
  }
];

export const TicketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(mockClosedTickets);
  const [incidents, setIncidents] = useState<Incident[]>(mockClosedIncidents);

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
