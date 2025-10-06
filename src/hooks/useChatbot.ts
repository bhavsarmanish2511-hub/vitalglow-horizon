import { useState, useCallback } from "react";
import { useTickets } from "@/contexts/TicketsContext";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "report" | "ticket" | "incident";
  data?: any;
  ticketId?: string;
}

const sensitiveKeywords = [
  "payroll", "pay slip", "salary", "account number", "ssn", 
  "social security", "bank account", "credit card", "password", 
  "confidential", "sensitive, payslip"
];

const isSensitiveRequest = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return sensitiveKeywords.some(keyword => lowerMessage.includes(keyword));
};

export function useChatbot() {
  const { addTicket, addIncident, updateTicket } = useTickets();
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

  // Leave flow state
  const [awaitingLeaveDate, setAwaitingLeaveDate] = useState(false);

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
    const id = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
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

    addMessage({ role: "user", content, type: "text" });
    setInputValue("");

    // Simulate thinking
    await simulateTyping(5000);

    const lowerContent = content.toLowerCase();
    const isSensitive = isSensitiveRequest(content);

    // --- LEAVE FLOW ---
    const isLeaveRequest = lowerContent.includes("leave");

    if (awaitingLeaveDate) {
      const leaveDate = content.trim();
      setAwaitingLeaveDate(false);

      // Generate ticket ID
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
      const srNumber = Math.floor(Math.random() * 900) + 100;
      const ticketId = `SR${dateStr}${srNumber}`;
      const now = new Date().toLocaleString();
      const chatHistory = getChatHistory();

      addMessage({
        role: "assistant",
        content: `Thank you! Updating your leave for ${leaveDate}. Creating Service Request ${ticketId}...`,
        type: "text"
      });

      await simulateTyping(1500);

      const newTicket = {
        id: ticketId,
        title: "Leave Update Request",
        description: `Leave update for ${leaveDate}`,
        status: "completed",
        priority: "medium",
        assignee: "AI Assistant",
        created: now,
        updated: now,
        category: "Leave",
        chatHistory,
        comments: [
          { author: "AI Assistant", content: `Leave updated for ${leaveDate}`, timestamp: now }
        ]
      };

      addTicket(newTicket);

      addMessage({
        role: "assistant",
        content: `Your leave for ${leaveDate} has been updated successfully. Service Request ${ticketId} created and closed.`,
        type: "ticket",
        ticketId: ticketId,
        data: newTicket
      });

      return;
    }

    if (isLeaveRequest) {
      setAwaitingLeaveDate(true);
      addMessage({
        role: "assistant",
        content: "Please let me know which date I should apply leave for you.",
        type: "text"
      });
      return;
    }
    // --- END LEAVE FLOW ---

    // --- Other request types (existing logic, unchanged) ---
    const isPayslipRequest = lowerContent.includes("payslip") || lowerContent.includes("pay slip");
    const isPayrollRequest = lowerContent.includes("payroll") || 
                            lowerContent.includes("pay slip") || 
                            lowerContent.includes("salary") ||
                            lowerContent.includes("pay check") ||
                            lowerContent.includes("payslip");
    const isFinancialReportRequest = (lowerContent.includes("financial") && lowerContent.includes("report")) ||
                                      (lowerContent.includes("finance") && lowerContent.includes("report"));
    const isInstallRequest = lowerContent.includes("install") || 
                            lowerContent.includes("application") ||
                            lowerContent.includes("software");
    const isExpenseRequest = (lowerContent.includes("expense") || 
                             lowerContent.includes("summary")) && !isFinancialReportRequest;
    const isAccessRequest = lowerContent.includes("access") || 
                           lowerContent.includes("database") ||
                           lowerContent.includes("permission");
    const isStatusRequest = lowerContent.includes("status") || 
                           lowerContent.includes("incident") ||
                           lowerContent.includes("check");
    const isSensitiveReq = lowerContent.includes("payroll") ||
                           lowerContent.includes("payslip") ||
                           lowerContent.includes("salary") ||
                           lowerContent.includes("finance") ||
                           lowerContent.includes("financial") ||
                           isFinancialReportRequest ||
                           lowerContent.includes("hr");

    // Generate SR Ticket ID with date format (no hyphens)
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const srNumber = Math.floor(Math.random() * 900) + 100;
    const ticketId = `SR${dateStr}${srNumber}`;
    const now = new Date().toLocaleString();
    const chatHistory = getChatHistory();

    // --- Conversational Payslip Flow ---
    if (isPayslipRequest) {
      addMessage({
        role: "assistant",
        content: `I'll help you with that. Creating Service Request ${ticketId}`,
        type: "text"
      });

      await simulateTyping(1000);

      addMessage({
        role: "assistant",
        content: "Please let me check.",
        type: "text"
      });

      await simulateTyping(4000);

      addMessage({
        role: "assistant",
        content: "It seems there is an issue with the password protected file, checking please wait.",
        type: "text"
      });

      await simulateTyping(3000);

      addMessage({
        role: "assistant",
        content: "I'm unable to resolve this issue, as it contains sensitive data, let me create an incident and assign a support engineer to you.",
        type: "text"
      });

      await simulateTyping(2000);

      const newTicket = {
        id: ticketId,
        title: "Payslip Request",
        description: content,
        status: "open",
        priority: "high",
        assignee: "Support Engineer (martha@intelletica.com)",
        created: now,
        updated: now,
        category: "Payroll",
        chatHistory,
        relatedIncident: "",
        comments: [
          { author: "AI Assistant", content: "Service Request created successfully", timestamp: now }
        ]
      };
      addTicket(newTicket);

      addMessage({
        role: "assistant",
        content: `Service Request ${ticketId} created successfully.`,
        type: "ticket",
        ticketId: ticketId,
        data: newTicket
      });

      await simulateTyping(1500);

      // Create the incident
      const incidentId = `INC${Math.floor(Math.random() * 90000000) + 10000000}`;
      const newIncident = {
        id: incidentId,
        title: `Sensitive Payslip Access - Linked to ${ticketId}`,
        description: `Incident created for sensitive payslip request: ${content}`,
        status: "pending-approval",
        priority: "critical",
        assignee: "martha@intelletica.com",
        createdBy: "james@fincompany.com",
        created: now,
        updated: now,
        category: "Security",
        chatHistory,
        relatedSR: ticketId,
        approvalStatus: 'pending' as const,
        emailSent: false,
        timeline: [
          { status: "Created", timestamp: now, description: `Incident created by AI Assistant (Linked to ${ticketId})` },
          { status: "Routed", timestamp: now, description: "Routed to Support Engineer for approval" }
        ]
      };
      addIncident(newIncident);
      
      // Update ticket with related incident
      updateTicket(ticketId, { relatedIncident: incidentId });

      addMessage({
        role: "assistant",
        content: `Incident ${incidentId} created and routed to IT Support Engineer dashboard. Awaiting approval.`,
        type: "incident",
        ticketId: incidentId,
        data: newIncident
      });

      return;
    }
    // --- End Payslip Flow ---

    // Handle financial report and other sensitive requests
    if (isFinancialReportRequest || isPayrollRequest || isInstallRequest) {
      addMessage({
        role: "assistant",
        content: `I'll help you with that. Creating Service Request ${ticketId}...`,
        type: "text"
      });

      await simulateTyping(1000);

      const newTicket = {
        id: ticketId,
        title: isFinancialReportRequest 
          ? "Financial Report Access Request" 
          : isPayrollRequest 
            ? "Payroll Information Request" 
            : "Application Installation Request",
        description: content,
        status: "open",
        priority: isSensitiveReq ? "high" : "medium",
        assignee: isFinancialReportRequest || isPayrollRequest 
          ? "Support Engineer (martha@intelletica.com)" 
          : "IT Support",
        created: now,
        updated: now,
        category: isFinancialReportRequest 
          ? "Finance" 
          : isPayrollRequest 
            ? "Payroll" 
            : "Technical",
        chatHistory,
        relatedIncident: "",
        comments: [
          { author: "AI Assistant", content: "Service Request created successfully", timestamp: now }
        ]
      };
      
      addTicket(newTicket);
      
      addMessage({
        role: "assistant",
        content: `Service Request ${ticketId} created successfully.`,
        type: "ticket",
        ticketId: ticketId,
        data: newTicket
      });

      await simulateTyping(4000);

      if (isSensitiveReq) {
        addMessage({
          role: "assistant",
          content: "This request contains sensitive information. Creating an incident and routing to Support Engineer...",
          type: "text"
        });

        await simulateTyping(2000);

        const incidentId = `INC${Math.floor(Math.random() * 90000000) + 10000000}`;
        
        const newIncident = {
          id: incidentId,
          title: `Sensitive ${isFinancialReportRequest ? 'Financial Report' : isPayrollRequest ? 'Payroll' : 'Data'} Access - Linked to ${ticketId}`,
          description: `Incident created for sensitive request: ${content}`,
          status: "pending-approval",
          priority: "critical",
          assignee: "martha@intelletica.com",
          createdBy: "james@fincompany.com",
          created: now,
          updated: now,
          category: "Security",
          chatHistory,
          relatedSR: ticketId,
          approvalStatus: 'pending' as const,
          emailSent: false,
          timeline: [
            { status: "Created", timestamp: now, description: `Incident created by AI Assistant (Linked to ${ticketId})` },
            { status: "Routed", timestamp: now, description: "Routed to Support Engineer for approval" }
          ]
        };
        
        addIncident(newIncident);
        updateTicket(ticketId, { relatedIncident: incidentId });
        
        addMessage({
          role: "assistant",
          content: `Incident ${incidentId} created and routed to Support Engineer dashboard. Awaiting approval.`,
          type: "incident",
          ticketId: incidentId,
          data: newIncident
        });
      } else {
        addMessage({
          role: "assistant",
          content: "Processing your request...",
          type: "text"
        });

        await simulateTyping(2000);

        const updatedTicket = {
          ...newTicket,
          status: "resolved",
          updated: new Date().toLocaleString(),
          comments: [
            ...(newTicket.comments || []),
            { 
              author: "AI Assistant", 
              content: isInstallRequest 
                ? "Application installation instructions have been sent to your email. Installation package is available on the IT portal." 
                : "Your request has been processed. Please check your email for the information.",
              timestamp: new Date().toLocaleString() 
            }
          ]
        };

        addTicket(updatedTicket);

        addMessage({
          role: "assistant",
          content: `✓ Service Request ${ticketId} resolved successfully. ${isInstallRequest ? 'Installation instructions sent to your email.' : 'Information has been sent to your email.'}`,
          type: "ticket",
          ticketId: ticketId,
          data: updatedTicket
        });
      }
    } else if (isExpenseRequest) {
      addMessage({
        role: "assistant",
        content: `I'll generate the expense summary for you. Creating Service Request ${ticketId}...`,
        type: "text"
      });

      await simulateTyping(1500);

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
        content: `I'll help you with database access. Creating Service Request ${ticketId}...`,
        type: "text"
      });

      await simulateTyping(1500);
      
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
      
      addTicket(newTicket);
      
      addMessage({
        role: "assistant",
        content: `Service Request ${ticketId} created for database access.`,
        type: "ticket",
        ticketId: ticketId,
        data: newTicket
      });
    } else {
      const responses = [
        "I'd be happy to help you with that. Could you provide more details? I can assist with payroll requests, application installation, expense reports, database access, or checking incident status.",
        "Sure! I'm here to assist. Are you looking for help with payroll information, installing applications, generating reports, or something else?",
        "I'm ready to help! Let me know if you need access to payroll, want to install an application, generate a report, need database permissions, or want to check on a ticket status."
      ];
      addMessage({
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        type: "text"
      });
    }
  }, [addMessage, simulateTyping, getChatHistory, addTicket, addIncident, updateTicket, awaitingLeaveDate]);

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isTyping
  };
}