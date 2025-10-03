import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, FileText, AlertCircle, MessageSquare, CheckCircle } from "lucide-react";
import { TicketDetailsModal } from "@/components/tickets/TicketDetailsModal";
import { IncidentDetailsModal } from "@/components/incidents/IncidentDetailsModal";
import { useTickets } from "@/contexts/TicketsContext";

// Mock data
const openServiceRequests = [
  {
    id: "SR12345",
    title: "Payroll Access Request",
    description: "Request to access payroll information for Q4 2024",
    status: "in-progress",
    priority: "high",
    assignee: "Finance IT Team",
    created: "2024-01-15 09:30",
    updated: "2024-01-15 14:20",
    category: "Payroll",
    comments: [
      { author: "AI Assistant", content: "Ticket created and routed to Finance IT Team", timestamp: "2024-01-15 09:30" },
      { author: "Finance IT Team", content: "Request received, processing sensitive information", timestamp: "2024-01-15 14:20" }
    ],
    chatHistory: [
      { role: "user", content: "I need to access my payroll, could you please help me with that?" },
      { role: "assistant", content: "Sure, I will be happy to assist you with that. As this contains sensitive information, I'll create a service request and route it to the Financial IT team." }
    ]
  },
  {
    id: "SR12346",
    title: "Expense Summary Request",
    description: "Request for Q4 2024 expense summary report",
    status: "pending",
    priority: "medium",
    assignee: "Finance Team",
    created: "2024-01-15 11:00",
    updated: "2024-01-15 11:00",
    category: "Reports",
    comments: [
      { author: "AI Assistant", content: "Service request created successfully", timestamp: "2024-01-15 11:00" }
    ],
    chatHistory: [
      { role: "user", content: "Show me the latest expense summary" },
      { role: "assistant", content: "I'll generate the Q4 2024 expense summary for you. Creating service request..." }
    ]
  }
];

const openIncidents = [
  {
    id: "INC56789",
    title: "Sensitive Payroll Data Access",
    description: "Incident created for accessing sensitive payroll information",
    status: "in-progress",
    priority: "critical",
    assignee: "andrews@intelletica.com",
    created: "2024-01-15 09:31",
    updated: "2024-01-15 15:45",
    category: "Security",
    timeline: [
      { status: "Created", timestamp: "2024-01-15 09:31", description: "Incident created by AI Assistant" },
      { status: "Routed", timestamp: "2024-01-15 09:32", description: "Routed to Finance Manager" },
      { status: "Approved", timestamp: "2024-01-15 10:15", description: "Approved by andrews@intelletica.com" },
      { status: "In Progress", timestamp: "2024-01-15 14:20", description: "Finance IT Team processing request" }
    ],
    relatedSR: "SR12345"
  }
];

const pastIncidents = [
  {
    id: "INC56788",
    title: "Database Access Issue",
    description: "Resolved database access problem",
    status: "resolved",
    priority: "high",
    assignee: "IT Support",
    created: "2024-01-10 08:00",
    updated: "2024-01-12 16:30",
    category: "Technical",
    timeline: [
      { status: "Created", timestamp: "2024-01-10 08:00", description: "Issue reported" },
      { status: "In Progress", timestamp: "2024-01-10 09:00", description: "IT team investigating" },
      { status: "Resolved", timestamp: "2024-01-12 16:30", description: "Access restored" }
    ],
    relatedSR: "SR12340"
  }
];

const Dashboard = () => {
  const { tickets, incidents } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  
  // Separate tickets and incidents by status - ONLY from context (real-time from chat)
  const openTickets = tickets.filter(t => t.status !== "resolved" && t.status !== "closed" && t.status !== "completed");
  const openIncidentsData = incidents.filter(i => i.status !== "resolved" && i.status !== "closed");
  
  // Closed tickets and incidents for Past Ticket History
  const closedTickets = tickets.filter(t => t.status === "resolved" || t.status === "closed" || t.status === "completed");
  const closedIncidents = incidents.filter(i => i.status === "resolved" || i.status === "closed");
  
  // Combine closed items with type information
  const pastTicketHistory = [
    ...closedTickets.map(t => ({ ...t, type: "Service Request" as const })),
    ...closedIncidents.map(i => ({ ...i, type: "Incident" as const }))
  ].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());

  const quickActions = [
    { label: "Access Payroll", prompt: "I need to access my payroll information" },
    { label: "Generate Expense Report", prompt: "Show me the latest expense summary" },
    { label: "Check Incident Status", prompt: "What's the status of my incident?" },
    { label: "Request Database Access", prompt: "I need access to the finance database" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, James</h1>
        <p className="text-muted-foreground">
          Your AI assistant is ready to help with reports, tickets, and incidents.
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Click an action to start a conversation with the AI assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Button
              key={index}
              variant="outline"
              className="h-auto py-4 flex flex-col items-start gap-2 hover:bg-primary/10 hover:border-primary transition-all text-foreground" // <-- Add text-foreground here
              onClick={() => {
                window.dispatchEvent(new CustomEvent('chatbot-prompt', { detail: action.prompt }));
              }}
            >
              <span className="font-medium text-sm text-foreground">{action.label}</span> {/* <-- Add text-foreground */}
              <span className="text-xs text-muted-foreground text-left">{action.prompt}</span>
            </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Open Service Requests - Only from chat (real-time) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Open Service Requests ({openTickets.length})
          </CardTitle>
          <CardDescription>
            Service requests created via AI Assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          {openTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No open service requests</p>
              <p className="text-sm mt-1">Use the AI Assistant to create new requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-primary/5"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs hover:bg-primary/10 transition-colors">{ticket.id}</Badge>
                      <Badge className={
                        ticket.status === "resolved" || ticket.status === "completed"
                          ? "bg-success/10 text-success"
                          : ticket.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : "bg-primary/10 text-primary"
                      }>
                        {ticket.status.replace("-", " ")}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">AI Created</Badge>
                    </div>
                    <Badge className={ticket.priority === "high" || ticket.priority === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{ticket.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated: {ticket.updated}
                    </span>
                    <span>Assignee: {ticket.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Open Incidents - Only from chat (real-time sync with Support Engineer) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Open Incidents ({openIncidentsData.length})
          </CardTitle>
          <CardDescription>
            Incidents linked to your service requests (synced with IT Support Engineer)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {openIncidentsData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No open incidents</p>
              <p className="text-sm mt-1">Incidents will appear here when sensitive requests are escalated</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openIncidentsData.map((incident) => (
                <div
                  key={incident.id}
                  className="border border-warning/30 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-warning/5"
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs hover:bg-warning/10 transition-colors">{incident.id}</Badge>
                      <Badge className={
                        incident.status === "pending-approval"
                          ? "bg-warning/10 text-warning"
                          : incident.status === "in-progress"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted/10 text-muted-foreground"
                      }>
                        {incident.status.replace("-", " ")}
                      </Badge>
                      {incident.relatedSR && (
                        <Badge variant="secondary" className="text-xs">
                          Linked to {incident.relatedSR}
                        </Badge>
                      )}
                    </div>
                    <Badge className="bg-destructive/10 text-destructive">
                      {incident.priority}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{incident.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{incident.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated: {incident.updated}
                    </span>
                    <span>Assignee: {incident.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Ticket History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Past Ticket History ({pastTicketHistory.length})
          </CardTitle>
          <CardDescription>
            All closed service requests and incidents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pastTicketHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No closed tickets yet</p>
              <p className="text-sm mt-1">Resolved tickets will appear here</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {pastTicketHistory.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border border-border rounded-lg mb-3 px-4 bg-success/5">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start justify-between w-full pr-4">
                      <div className="flex flex-col items-start gap-2 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="font-mono text-xs">{item.id}</Badge>
                          <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                          <Badge className="bg-success/10 text-success">
                            {item.status.replace("-", " ")}
                          </Badge>
                          <Badge className={item.priority === "high" || item.priority === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}>
                            {item.priority}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Description:</strong>
                        <p className="mt-1">{item.description}</p>
                      </div>
                      
                      <div className="text-xs text-success bg-success/10 rounded p-3">
                        <strong>Resolution:</strong> Ticket successfully resolved and closed by {item.assignee}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <p className="font-medium">{item.created}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Closed:</span>
                          <p className="font-medium">{item.updated}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <p className="font-medium">{item.category}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Assignee:</span>
                          <p className="font-medium">{item.assignee}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          if (item.type === "Service Request") {
                            setSelectedTicket(item);
                          } else {
                            setSelectedIncident(item);
                          }
                        }}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          open={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
