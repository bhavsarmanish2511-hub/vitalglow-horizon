import { useState, useCallback } from "react";
import { useTickets } from "@/contexts/TicketsContext";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "report" | "ticket" | "incident";
  data?: any;
  ticketId?: string; // Link message to created ticket/incident
}

const sensitiveKeywords = [
  "payroll", "pay slip", "salary", "account number", "ssn", 
  "social security", "bank account", "credit card", "password", 
  "confidential", "sensitive"
];

const isSensitiveRequest = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return sensitiveKeywords.some(keyword => lowerMessage.includes(keyword));
};

export function useChatbot() {
  const { addTicket, addIncident } = useTickets();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey James, how can I assist you today?",
      type: "text"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Store chat history for ticket creation
  const getChatHistory = useCallback(() => {
    return messages
      .filter(m => m.type === "text" && m.role !== "assistant" || m.role === "user")
      .map(m => ({
        role: m.role,
        content: m.content,
        timestamp: new Date().toLocaleString()
      }));
  }, [messages]);

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    const id = Date.now().toString();
    setMessages((prev) => [...prev, { ...message, id }]);
    return id;
  }, []);

  const simulateTyping = useCallback(async (delay = 1500) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    addMessage({ role: "user", content, type: "text" });
    setInputValue("");

    await simulateTyping();

    const lowerContent = content.toLowerCase();
    const isSensitive = isSensitiveRequest(content);

    // Better conversational matching
    const isPayrollRequest = lowerContent.includes("payroll") || 
                            lowerContent.includes("pay slip") || 
                            lowerContent.includes("salary") ||
                            lowerContent.includes("pay check");
    const isExpenseRequest = lowerContent.includes("expense") || 
                            lowerContent.includes("report") ||
                            lowerContent.includes("summary");
    const isAccessRequest = lowerContent.includes("access") || 
                           lowerContent.includes("database") ||
                           lowerContent.includes("permission");
    const isStatusRequest = lowerContent.includes("status") || 
                           lowerContent.includes("incident") ||
                           lowerContent.includes("check");

    // Handle different types of requests
    if (isPayrollRequest) {
      addMessage({
        role: "assistant",
        content: "Sure, I will be happy to assist you with that.",
        type: "text"
      });

      await simulateTyping(1000);

      if (isSensitive) {
        addMessage({
          role: "assistant",
          content: "As this contains sensitive information, I'll create an incident and route it to the Financial IT team.",
          type: "text"
        });

        await simulateTyping(1500);

        // Create incident with chat history
        const incidentId = `INC${Math.floor(Math.random() * 90000) + 10000}`;
        const now = new Date().toLocaleString();
        const chatHistory = getChatHistory();
        
        const newIncident = {
          id: incidentId,
          title: "Sensitive Payroll Data Access",
          description: "Request to access sensitive payroll information",
          status: "pending-approval",
          priority: "critical",
          assignee: "andrews@intelletica.com",
          created: now,
          updated: now,
          category: "Security",
          chatHistory,
          timeline: [
            { status: "Created", timestamp: now, description: "Incident created by AI Assistant" },
            { status: "Routed", timestamp: now, description: "Routed to Finance Manager for approval" }
          ]
        };
        
        // Add to global state
        addIncident(newIncident);
        
        addMessage({
          role: "assistant",
          content: `Incident ${incidentId} created successfully. Awaiting approval from Finance Manager (andrews@intelletica.com).`,
          type: "incident",
          ticketId: incidentId,
          data: newIncident
        });
      } else {
        // Create SR ticket with chat history
        const ticketId = `SR${Math.floor(Math.random() * 90000) + 10000}`;
        const now = new Date().toLocaleString();
        const chatHistory = getChatHistory();
        
        const newTicket = {
          id: ticketId,
          title: "Payroll Information Request",
          description: content,
          status: "open",
          priority: "high",
          assignee: "Finance Team",
          created: now,
          updated: now,
          category: "Payroll",
          chatHistory,
          comments: [
            { author: "AI Assistant", content: "Ticket created and routed to Finance Team", timestamp: now }
          ]
        };
        
        // Add to global state
        addTicket(newTicket);
        
        addMessage({
          role: "assistant",
          content: `Service Request ${ticketId} created successfully.`,
          type: "ticket",
          ticketId: ticketId,
          data: newTicket
        });
      }
    } else if (isExpenseRequest) {
      addMessage({
        role: "assistant",
        content: "I'll generate the expense summary for you. Creating service request...",
        type: "text"
      });

      await simulateTyping(1500);

      const ticketId = `SR${Math.floor(Math.random() * 90000) + 10000}`;
      const now = new Date().toLocaleString();
      const chatHistory = getChatHistory();
      
      const newTicket = {
        id: ticketId,
        title: "Q4 2024 Expense Summary",
        description: content,
        status: "completed",
        priority: "medium",
        assignee: "Finance Team",
        created: now,
        updated: now,
        category: "Reports",
        chatHistory,
        comments: [
          { author: "AI Assistant", content: "Service request created successfully", timestamp: now }
        ]
      };
      
      // Add to global state
      addTicket(newTicket);
      
      addMessage({
        role: "assistant",
        content: `Here's the Q4 2024 Expense Summary. Service Request ${ticketId} created.`,
        type: "report",
        ticketId: ticketId,
        data: {
          ...newTicket,
          summary: "Total Expenses: $125,000 | Status: Generated | SharePoint Link Available",
          sharepointLink: `https://fincompany.sharepoint.com/reports/expense-Q4-2024-${Date.now()}`
        }
      });
    } else if (isStatusRequest) {
      addMessage({
        role: "assistant",
        content: "Let me check the status of your recent incidents...",
        type: "text"
      });

      await simulateTyping(1500);

      addMessage({
        role: "assistant",
        content: "Here's the latest status of incident INC56789:",
        type: "incident",
        data: {
          id: "INC56789",
          title: "Sensitive Payroll Data Access",
          status: "in-progress",
          priority: "critical",
          assignee: "Finance IT Team",
          timeline: [
            { status: "Created", timestamp: "2024-01-15 09:31", description: "Incident created by AI Assistant" },
            { status: "Routed", timestamp: "2024-01-15 09:32", description: "Routed to Finance Manager" },
            { status: "Approved", timestamp: "2024-01-15 10:15", description: "Approved by andrews@intelletica.com" },
            { status: "In Progress", timestamp: new Date().toLocaleString(), description: "Finance IT Team processing request" }
          ]
        }
      });
    } else if (isAccessRequest) {
      addMessage({
        role: "assistant",
        content: "I'll help you with database access. Let me create a service request for you.",
        type: "text"
      });

      await simulateTyping(1500);

      const ticketId = `SR${Math.floor(Math.random() * 90000) + 10000}`;
      const now = new Date().toLocaleString();
      const chatHistory = getChatHistory();
      
      const newTicket = {
        id: ticketId,
        title: "Database Access Request",
        description: content,
        status: "pending",
        priority: "medium",
        assignee: "IT Support",
        created: now,
        updated: now,
        category: "Technical",
        chatHistory,
        comments: [
          { author: "AI Assistant", content: "Database access request created", timestamp: now }
        ]
      };
      
      // Add to global state
      addTicket(newTicket);
      
      addMessage({
        role: "assistant",
        content: `Service Request ${ticketId} created for database access.`,
        type: "ticket",
        ticketId: ticketId,
        data: newTicket
      });
    } else {
      // More conversational default response
      const responses = [
        "I'd be happy to help you with that. Could you provide more details? I can assist with payroll requests, expense reports, database access, or checking incident status.",
        "Sure! I'm here to assist. Are you looking for help with payroll information, generating reports, or something else?",
        "I'm ready to help! Let me know if you need access to payroll, want to generate a report, need database permissions, or want to check on a ticket status."
      ];
      addMessage({
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        type: "text"
      });
    }
  }, [addMessage, simulateTyping, getChatHistory, addTicket, addIncident]);

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isTyping
  };
}
