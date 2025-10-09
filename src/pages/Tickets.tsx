import { useState, useEffect } from "react";
import { Ticket, Clock, CheckCircle2, AlertCircle, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TicketDetailsModal } from "@/components/tickets/TicketDetailsModal";
import { useTickets } from "@/contexts/TicketsContext";
import type { Ticket as TicketType } from "@/contexts/TicketsContext";
import { useToast } from "@/hooks/use-toast";

const Tickets = () => {
  const { tickets } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const { toast } = useToast();

  // Listen for ticket resolution notifications
  useEffect(() => {
    const handleTicketResolved = (event: CustomEvent) => {
      const { srId, title } = event.detail;
      toast({
        title: "Ticket Resolved",
        description: `${srId}: ${title} has been resolved by Support Engineer`,
        duration: 5000,
      });
    };

    window.addEventListener('ticket-resolved', handleTicketResolved as EventListener);
    return () => {
      window.removeEventListener('ticket-resolved', handleTicketResolved as EventListener);
    };
  }, [toast]);

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
    switch (normalizedStatus) {
      case "new":
      case "approved":
        return { icon: Clock, color: "text-warning", bg: "bg-warning/10" };
      case "in-progress":
        return { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10" };
      case "closed":
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" };
      default:
        return { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
      case "high":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-warning/10 text-warning";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Service Tickets</h1>
          <p className="text-muted-foreground mt-2">Track and manage ServiceNow service requests</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tickets.length === 0 ? (
            <Card className="p-12 text-center">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Service Tickets</h3>
              <p className="text-muted-foreground">Open the AI Assistant chat to create service requests</p>
            </Card>
          ) : (
            tickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={ticket.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`h-12 w-12 rounded-lg ${statusConfig.bg} flex items-center justify-center`}>
                      <Ticket className={`h-6 w-6 ${statusConfig.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{ticket.title}</h3>
                        <Badge variant="outline" className="text-xs font-mono">
                          {ticket.id}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bg}`}>
                          <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                          <span className={statusConfig.color}>{ticket.status.replace("-", " ")}</span>
                        </div>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ticket.assignee}
                        </span>
                        <span className="text-muted-foreground">{ticket.category}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })
          )}
        </div>
      </div>

      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
};

export default Tickets;
