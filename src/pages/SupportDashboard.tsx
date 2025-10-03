import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from '@/components/support/MetricCard';
import { TicketDetailView } from '@/components/support/TicketDetailView';
import { mockTickets, Ticket } from '@/data/mockTickets';
import { 
  Ticket as TicketIcon, 
  CheckCircle, 
  Clock, 
  Star, 
  TrendingUp, 
  Target,
  AlertCircle
} from 'lucide-react';

export default function SupportDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const metrics = [
    { title: 'Open Tickets', value: '23', change: 12, icon: TicketIcon, color: 'text-primary' },
    { title: 'Tickets Resolved', value: '156', change: 8, icon: CheckCircle, color: 'text-success' },
    { title: 'Avg Resolution Time', value: '2.5h', change: -15, icon: Clock, color: 'text-warning' },
    { title: 'Customer Satisfaction', value: '4.8', change: 5, icon: Star, color: 'text-warning' },
    { title: 'Escalation Rate', value: '8%', change: -3, icon: TrendingUp, color: 'text-destructive' },
    { title: 'Resolution Accuracy', value: '94%', change: 2, icon: Target, color: 'text-success' },
  ];

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleNotificationTicketClick = (ticketId: string) => {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'resolved':
        return 'bg-success/10 text-success';
      case 'escalated':
        return 'bg-destructive/10 text-destructive';
      case 'in-progress':
        return 'bg-primary/10 text-primary';
      case 'new':
        return 'bg-warning/10 text-warning';
      case 'waiting-for-user':
        return 'bg-muted/50 text-muted-foreground';
      default:
        return 'bg-muted';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Support Engineer Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor tickets, incidents, and performance metrics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TicketIcon className="h-5 w-5 text-primary" />
            Assigned Incidents ({mockTickets.filter(t => t.type === 'incident').length})
          </CardTitle>
          <CardDescription>
            Click on an incident number to view detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTickets.filter(t => t.type === 'incident').map((ticket) => (
              <div
                key={ticket.id}
                className={`border border-border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                  ticket.type === 'incident' ? 'bg-warning/5' : 'bg-card'
                }`}
                onClick={() => handleTicketClick(ticket)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="font-mono text-xs">{ticket.id}</Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace("-", " ")}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    {ticket.type === 'incident' && (
                      <Badge variant="outline" className="bg-warning/10 text-warning">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Incident
                      </Badge>
                    )}
                    {ticket.createdBy === 'james@fincompany.com' && (
                      <Badge variant="secondary" className="text-xs">
                        From Business User
                      </Badge>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{ticket.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{ticket.description}</p>
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
        </CardContent>
      </Card>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailView
          ticket={selectedTicket}
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
