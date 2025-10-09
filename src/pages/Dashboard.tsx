import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, FileText, AlertCircle, MessageSquare, CheckCircle } from "lucide-react";
import { TicketDetailsModal } from "@/components/tickets/TicketDetailsModal";
import { IncidentDetailsModal } from "@/components/incidents/IncidentDetailsModal";
import { useTickets } from "@/contexts/TicketsContext";
import { useToast } from "@/hooks/use-toast";

export const handleNotificationClickHelper = (
  ticketId: string,
  tickets: any[],
  incidents: any[],
  setSelectedTicket: (ticket: any) => void,
  setSelectedIncident: (incident: any) => void
) => {
  const ticket = tickets.find(t => t.id === ticketId);
  const incident = incidents.find(i => i.id === ticketId);
  
  if (ticket) {
    setSelectedTicket(ticket);
  } else if (incident) {
    setSelectedIncident(incident);
  }
};

const Dashboard = () => {
  const { tickets, incidents } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleTicketResolved = (event: CustomEvent) => {
      const { incidentId, srId, title } = event.detail;
      toast({
        title: "Ticket Resolved",
        description: `Your request "${title}" has been resolved and closed.`,
      });
    };

    window.addEventListener('ticket-resolved' as any, handleTicketResolved);
    return () => {
      window.removeEventListener('ticket-resolved' as any, handleTicketResolved);
    };
  }, [toast]);

  // Listen for notification clicks from header
  useEffect(() => {
    const handleNotificationClicked = (event: CustomEvent) => {
      handleNotificationClick(event.detail);
    };

    window.addEventListener('notification-clicked' as any, handleNotificationClicked);
    return () => {
      window.removeEventListener('notification-clicked' as any, handleNotificationClicked);
    };
  }, [tickets, incidents]);
  
  const openTickets = tickets.filter(t => {
    const status = t.status.toLowerCase();
    return status !== "resolved" && status !== "closed";
  });
  const openIncidentsData = incidents.filter(i => {
    const status = i.status.toLowerCase();
    return status !== "resolved" && status !== "closed";
  });
  const closedTickets = tickets.filter(t => {
    const status = t.status.toLowerCase();
    return status === "resolved" || status === "closed";
  });
  const closedIncidents = incidents.filter(i => {
    const status = i.status.toLowerCase();
    return status === "resolved" || status === "closed";
  });
  const pastTicketHistory = [
    ...closedTickets.map(t => ({ ...t, type: "Service Request" as const })),
    ...closedIncidents.map(i => ({ ...i, type: "Incident" as const }))
  ].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());

  // Updated Quick Actions
  const quickActions = [
    { label: "Password Unlock", prompt: "Password Unlock" },
    { label: "Check Incident Status", prompt: "What's the status of my incident?" },
    { label: "Access Payroll", prompt: "I need to access my payroll information" },
    { label: "Request Database Access", prompt: "I need access to the finance database" }
  ];

  const handleNotificationClick = (ticketId: string) => {
    handleNotificationClickHelper(ticketId, tickets, incidents, setSelectedTicket, setSelectedIncident);
  };

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
                className="h-auto py-4 flex flex-col items-start gap-2 hover:bg-primary/10 hover:border-primary transition-all text-foreground"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('chatbot-prompt', { detail: action.prompt }));
                }}
              >
                <span className="font-medium text-sm text-foreground">{action.label}</span>
                <span className="text-xs text-muted-foreground text-left">{action.prompt}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Open Service Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Open Service Requests ({openTickets.length})
          </CardTitle>
          {/* <CardDescription>
            Service requests created via AI Assistant
          </CardDescription> */}
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

      {/* Open Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Open Incidents ({openIncidentsData.length})
          </CardTitle>
          {/* <CardDescription>
            Incidents linked to your service requests (synced with IT Support Engineer)
          </CardDescription> */}
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