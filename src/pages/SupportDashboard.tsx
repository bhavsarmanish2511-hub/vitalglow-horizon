import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from '@/components/support/MetricCard';
import { TicketDetailView } from '@/components/support/TicketDetailView';
import { IncidentDetailModal } from '@/components/support/IncidentDetailModal';
import { NotificationPanel } from '@/components/support/NotificationPanel';
import { mockTickets, Ticket } from '@/data/mockTickets';
import { useTickets, Incident } from '@/contexts/TicketsContext';
import { 
  Ticket as TicketIcon, 
  CheckCircle, 
  Clock, 
  Star, 
  TrendingUp, 
  Target,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SupportDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [lastIncidentCount, setLastIncidentCount] = useState(0);
  const { incidents } = useTickets();
  const { toast } = useToast();

  // Show notification when new incident arrives
  useEffect(() => {
    const newIncidents = incidents.filter(inc => inc.status === 'new' || inc.status === 'pending-approval');
    if (newIncidents.length > lastIncidentCount) {
      const latestIncident = newIncidents[0];
      toast({
        title: "New Incident Assigned",
        description: `${latestIncident.id}: ${latestIncident.title}`,
        duration: 5000,
      });
    }
    setLastIncidentCount(newIncidents.length);
  }, [incidents, lastIncidentCount, toast]);

  const metrics = [
    { title: 'Open Tickets', value: '23', change: 12, icon: TicketIcon, color: 'text-primary' },
    { title: 'Tickets Resolved', value: '156', change: 8, icon: CheckCircle, color: 'text-success' },
    { title: 'Avg Resolution Time', value: '2.5h', change: -15, icon: Clock, color: 'text-warning' },
    { title: 'Customer Satisfaction', value: '4.8', change: 5, icon: Star, color: 'text-warning' },
    { title: 'Escalation Rate', value: '8%', change: -3, icon: TrendingUp, color: 'text-destructive' },
    { title: 'Resolution Accuracy', value: '94%', change: -2, icon: Target, color: 'text-success' },
  ];

  // Combine mock tickets with incidents from Business User (real-time sync)
  const allIncidents = [
    ...mockTickets.filter(t => t.type === 'incident'),
    ...incidents.map(inc => ({
      ...inc,
      type: 'incident' as const,
      createdBy: 'james@fincompany.com' // Business user incidents
    }))
  ].sort((a, b) => {
    // Sort by creation date (most recent first)
    const dateA = new Date(a.created).getTime();
    const dateB = new Date(b.created).getTime();
    return dateB - dateA;
  });

  // Filter incidents based on selected status
  const filteredIncidents = statusFilter === "all" 
    ? allIncidents 
    : allIncidents.filter(incident => incident.status === statusFilter);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleNotificationClick = (ticketId: string) => {
    // Find incident by ID
    const foundItem = allIncidents.find(t => t.id === ticketId);
    if (foundItem && 'timeline' in foundItem) {
      setSelectedIncident(foundItem as Incident);
    } else if (foundItem) {
      setSelectedTicket(foundItem as Ticket);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-success/10 text-success';
      case 'escalated':
        return 'bg-destructive/10 text-destructive';
      case 'in-progress':
        return 'bg-primary/10 text-primary';
      case 'new':
      case 'pending-approval':
        return 'bg-warning/10 text-warning';
      case 'waiting-for-user':
        return 'bg-muted/50 text-muted-foreground';
      default:
        return 'bg-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Support Engineer Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor tickets, incidents, and performance metrics
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Incidents List - Including Business User Incidents (Real-time Sync) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TicketIcon className="h-5 w-5 text-primary" />
            Assigned Incidents ({allIncidents.length})
          </CardTitle>
          <CardDescription>
            Click on an incident number to view detailed information (synced with Business User dashboard)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status Filter */}
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="waiting-for-user">Waiting for User</SelectItem>
                <SelectItem value="pending-approval">Pending Approval</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing {filteredIncidents.length} of {allIncidents.length} incidents
            </span>
          </div>

          <div className="space-y-3">
            {filteredIncidents.map((ticket) => {
              const isIncident = 'timeline' in ticket;
              return (
              <div
                key={ticket.id}
                className={`border border-border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                  ticket.type === 'incident' ? 'bg-warning/5' : 'bg-card'
                }`}
                onClick={() => isIncident ? handleIncidentClick(ticket as Incident) : handleTicketClick(ticket as Ticket)}
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
              );
            })}
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

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        open={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}
