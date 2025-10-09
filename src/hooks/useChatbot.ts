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
  const { addTicket, addIncident, updateTicket, updateIncident } = useTickets();
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

  // Unlock Account flow state
  const [unlockFlow, setUnlockFlow] = useState<{
    active: boolean;
    step?:
      | "start"
      | "checking_issue"
      | "awaiting_try"
      | "awaiting_feedback"
      | "reset_link"
      | "incident_created"
      | "closed";
    incidentId?: string;
  }>({ active: false });

  // Financial report flow state (unchanged)
  const [financialReportFlow, setFinancialReportFlow] = useState<{
    active: boolean;
    step: 'initial' | 'details-provided' | 'confirm' | 'creating';
    reportDetails?: string;
  }>({ active: false, step: 'initial' });

  // Store chat history for ticket/incident creation
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

  // Simulate typing with 4 seconds delay
  const simulateTyping = useCallback(async (delay = 4000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    addMessage({ role: "user", content, type: "text" });
    setInputValue("");

    // Simulate thinking
    await simulateTyping();

    const lowerContent = content.toLowerCase();
    const isSensitive = isSensitiveRequest(content);

    // --- UNLOCK ACCOUNT FLOW (as Incident) ---
    const unlockTriggers = [
      "unlock account", "password unlock", "account unlock", "reset password", "forgot password", "unable to login"
    ];
    const isUnlockRequest = unlockTriggers.some(trigger => lowerContent.includes(trigger));

    // If user triggers unlock account flow from quick actions or message
    if (isUnlockRequest && !unlockFlow.active) {
      setUnlockFlow({ active: true, step: "start" });
      addMessage({
        role: "assistant",
        content: "Hi! I'm here to help you unlock your account. Could you please describe the issue you're facing?",
        type: "text"
      });
      return;
    }

    // Unlock flow steps
    if (unlockFlow.active) {
      // Step: User describes issue (e.g., "I'm unable to login")
      if (unlockFlow.step === "start" && lowerContent.length > 0) {
        setUnlockFlow({ ...unlockFlow, step: "checking_issue" });
        addMessage({
          role: "assistant",
          content: "Sorry to hear that, let me check the issue.",
          type: "text"
        });
        await simulateTyping();

        addMessage({
          role: "assistant",
          content: "Checking when was the last time password was updated, please hold on for few seconds.",
          type: "text"
        });
        await simulateTyping();

        // addMessage({
        //   role: "assistant",
        //   content: "Checking when was the last time password was updated, please hold on for few seconds.",
        //   type: "text"
        // });
        // await simulateTyping();

        addMessage({
          role: "assistant",
          content: "Thanks for waiting, your account has been unlocked, could you please try logging in.",
          type: "text"
        });
        setUnlockFlow({ ...unlockFlow, step: "awaiting_try" });
        return;
      }

      // Step: User tries to login ("sure, let me try to login")
      if (unlockFlow.step === "awaiting_try" && lowerContent.match(/try|login|logging in|let me/i)) {
        addMessage({
          role: "assistant",
          content: "Great, let me know",
          type: "text"
        });
        setUnlockFlow({ ...unlockFlow, step: "awaiting_feedback" });
        return;
      }

      // Step: User gives feedback (still unable to login)
      if (
        unlockFlow.step === "awaiting_feedback" &&
        (lowerContent.includes("still unable") ||
          lowerContent.includes("not able") ||
          lowerContent.includes("unable") ||
          lowerContent.includes("didn't work") ||
          lowerContent.includes("can't login"))
      ) {
        addMessage({
          role: "assistant",
          content: "Sorry to hear that, let me check, please hold on for few seconds",
          type: "text"
        });
        await simulateTyping();

        addMessage({
          role: "assistant",
          content:
            "In order to resolve the issue, I will provide you a link for password reset, for that I need to raise an Incident request",
          type: "text"
        });
        await simulateTyping();

        addMessage({
          role: "assistant",
          content:
            "please open the link, and set your new password. (link: www.passwordreset.com)",
          type: "text"
        });
        await simulateTyping();

        // Create incident
        const incidentId = `INC${Date.now()}`;
        const now = new Date().toLocaleString();
        const chatHistory = getChatHistory();

        const newIncident = {
          id: incidentId,
          title: "Password Reset Request",
          description: "User unable to login, password reset required.",
          status: "New",
          priority: "high",
          assignee: "AI Assistant",
          createdBy: "james@fincompany.com",
          created: now,
          updated: now,
          category: "Account Access",
          chatHistory,
          approvalStatus: 'pending' as const,
          emailSent: false,
          isAIOnly: true, // <-- This hides it from support dashboard
          timeline: [
            { status: "Created", timestamp: now, description: "Incident created by AI Assistant" },
            { status: "New", timestamp: now, description: "Password reset link provided to user." }
          ]
        };
        addIncident(newIncident);

        addMessage({
          role: "assistant",
          content: `An incident (${incidentId}) has been created for your password reset request.`,
          type: "incident",
          ticketId: incidentId,
          data: newIncident
        });

        setUnlockFlow({ ...unlockFlow, step: "incident_created", incidentId });
        return;
      }

      // Step: User confirms password reset and login
      if (
        unlockFlow.step === "incident_created" &&
        (lowerContent.includes("thanks") ||
          lowerContent.includes("able to login") ||
          lowerContent.includes("logged in") ||
          lowerContent.includes("success"))
      ) {
        addMessage({
          role: "assistant",
          content: "Great! I'm closing this incident now. Your account is working properly.",
          type: "text"
        });

        // Close the incident
        if (unlockFlow.incidentId) {
          updateIncident(unlockFlow.incidentId, {
            status: "Closed",
            resolvedBy: "AI Assistant",
            resolution: "User confirmed password reset and successful login."
          });
        }

        setUnlockFlow({ active: false, step: "closed" });
        return;
      }

      // For other messages, keep the flow active
      return;
    }
    // --- END PASSWORD UNLOCK FLOW ---

    // --- Other request types (existing logic, unchanged) ---
    const isPayslipRequest = lowerContent.includes("payslip") || lowerContent.includes("pay slip");
    const isPayrollRequest = lowerContent.includes("payroll") || 
                            lowerContent.includes("pay slip") || 
                            lowerContent.includes("salary") ||
                            lowerContent.includes("pay check") ||
                            lowerContent.includes("payslip");
    const isFinancialReportRequest = (lowerContent.includes("financial") && lowerContent.includes("report")) ||
                                      (lowerContent.includes("finance") && lowerContent.includes("report")) ||
                                      lowerContent.includes("license charges");
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
        status: "New",
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

      // Dispatch notification event for support engineer
      window.dispatchEvent(new CustomEvent('support-ticket-created', { 
        detail: { ticket: newTicket, type: 'ticket' } 
      }));

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
        status: "New",
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

      // Dispatch event for support engineer notification
      window.dispatchEvent(new CustomEvent('new-incident', { 
        detail: { incident: newIncident } 
      }));

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

    // --- Financial Report Conversational Flow ---
    if (isFinancialReportRequest || financialReportFlow.active) {
      // Step 1: Initial request
      if (!financialReportFlow.active) {
        setFinancialReportFlow({ active: true, step: 'initial' });
        
        addMessage({
          role: "assistant",
          content: "I would be able to help you on this, could you please let me know which Report you are referring to in Financial report?",
          type: "text"
        });
        return;
      }

      // Step 2: User provides details
      if (financialReportFlow.step === 'initial') {
        setFinancialReportFlow({ 
          active: true, 
          step: 'details-provided',
          reportDetails: content 
        });
        
        await simulateTyping(1500);
        
        addMessage({
          role: "assistant",
          content: "Thanks for the info, I'll try to fetch that document, for this I need to create a Service Request and then will be able to provide you the requested doc. Do you want me to do that?",
          type: "text"
        });
        return;
      }

      // Step 3: User confirms
      if (financialReportFlow.step === 'details-provided') {
        const isConfirmed = lowerContent.includes("yes") || 
                           lowerContent.includes("sure") || 
                           lowerContent.includes("ok") ||
                           lowerContent.includes("please");
        
        if (isConfirmed) {
          setFinancialReportFlow({ ...financialReportFlow, step: 'creating' });
          
          await simulateTyping(1500);
          
          addMessage({
            role: "assistant",
            content: `Creating Service Request ${ticketId} and assigning to Support Engineer...`,
            type: "text"
          });

          await simulateTyping(2000);

          const newTicket = {
            id: ticketId,
            title: "Financial Report Request - License Charges",
            description: financialReportFlow.reportDetails || content,
            status: "New",
            priority: "high",
            assignee: "Support Engineer (martha@intelletica.com)",
            createdBy: "james@fincompany.com",
            created: now,
            updated: now,
            category: "Finance",
            chatHistory,
            relatedIncident: "",
            comments: [
              { author: "AI Assistant", content: "Service Request created and assigned to Support Engineer", timestamp: now }
            ]
          };
          
          addTicket(newTicket);
          
          // Dispatch notification event for support engineer
          window.dispatchEvent(new CustomEvent('support-ticket-created', { 
            detail: { ticket: newTicket, type: 'ticket' } 
          }));
          
          addMessage({
            role: "assistant",
            content: `Service Request ${ticketId} created successfully and assigned to Support Engineer. They will review your request and provide the document shortly.`,
            type: "ticket",
            ticketId: ticketId,
            data: newTicket
          });

          setFinancialReportFlow({ active: false, step: 'initial' });
          return;
        } else {
          addMessage({
            role: "assistant",
            content: "No problem. Let me know if you need help with anything else.",
            type: "text"
          });
          setFinancialReportFlow({ active: false, step: 'initial' });
          return;
        }
      }
    }
    // --- End Financial Report Flow ---

    // Handle payroll and other sensitive requests (NOT financial reports)
    if (isPayrollRequest || isInstallRequest) {
      addMessage({
        role: "assistant",
        content: `I'll help you with that. Creating Service Request ${ticketId}...`,
        type: "text"
      });

      await simulateTyping(1000);

      const newTicket = {
        id: ticketId,
        title: isPayrollRequest 
          ? "Payroll Information Request" 
          : "Application Installation Request",
        description: content,
        status: "New",
        priority: isSensitiveReq ? "high" : "medium",
        assignee: isPayrollRequest 
          ? "Support Engineer (martha@intelletica.com)" 
          : "IT Support",
        created: now,
        updated: now,
        category: isPayrollRequest 
          ? "Payroll" 
          : "Technical",
        chatHistory,
        relatedIncident: "",
        comments: [
          { author: "AI Assistant", content: "Service Request created successfully", timestamp: now }
        ]
      };
      
      addTicket(newTicket);
      
      // Dispatch notification event for support engineer
      window.dispatchEvent(new CustomEvent('support-ticket-created', { 
        detail: { ticket: newTicket, type: 'ticket' } 
      }));
      
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
          title: `Sensitive ${isPayrollRequest ? 'Payroll' : 'Data'} Access - Linked to ${ticketId}`,
          description: `Incident created for sensitive request: ${content}`,
          status: "New",
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
        
        // Dispatch event for support engineer notification
        window.dispatchEvent(new CustomEvent('new-incident', { 
          detail: { incident: newIncident } 
        }));
        
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
          status: "Closed",
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
        status: "Closed",
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
          status: "In Progress",
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
        status: "New",
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
  }, [addMessage, simulateTyping, getChatHistory, addTicket, addIncident, updateTicket, unlockFlow, financialReportFlow, updateIncident]);

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isTyping
  };
}