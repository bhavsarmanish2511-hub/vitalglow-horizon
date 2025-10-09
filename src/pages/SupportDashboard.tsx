import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from '@/components/support/MetricCard';
import { TicketDetailView } from '@/components/support/TicketDetailView';
import { IncidentDetailModal } from '@/components/support/IncidentDetailModal';
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
import { addDays, startOfWeek, startOfMonth, startOfYear, isWithinInterval, parseISO } from 'date-fns';

// Enhanced TicketBreakdownModal
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

function TicketBreakdownModal({ open, onClose, title, data }) {
  const priorityColors = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  const priorityLabels = {
    critical: "P1",
    high: "P2",
    medium: "P3",
    low: "P4",
  };

  const renderBreakdown = (type, icon, breakdown) => {
    const total = breakdown.total;
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="font-semibold text-lg">{type}</span>
          <Badge className="bg-blue-100 text-blue-700 ml-2">{total} total</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {Object.entries(breakdown.priorities).map(([priority, count]) => {
            const countNum = typeof count === 'number' ? count : Number(count);
            return (
              <div key={priority} className="flex flex-col items-center">
                <Badge className={priorityColors[priority]}>
                  {priorityLabels[priority] || priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Badge>
                <span className="font-bold text-xl mt-1">{countNum}</span>
                <Progress
                  value={total ? (countNum / total) * 100 : 0}
                  className="w-16 h-2 mt-1"
                />
                <span className="text-xs text-muted-foreground mt-1">
                  {total ? ((countNum / total) * 100).toFixed(0) : 0}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={isOpen => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {renderBreakdown(
            "Incidents",
            <AlertCircle className="h-5 w-5 text-red-500" />,
            data.incidents
          )}
          {renderBreakdown(
            "Service Requests",
            <TicketIcon className="h-5 w-5 text-blue-500" />,
            data.serviceRequests
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SupportDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [breakdownModal, setBreakdownModal] = useState<'open' | 'resolved' | null>(null);

  // Date filter state
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year' | 'custom'>('all');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  const [lastIncidentCount, setLastIncidentCount] = useState(0);
  const { incidents, tickets } = useTickets();
  const { toast } = useToast();

  // Show notification when new incident arrives
  useEffect(() => {
    const newIncidents = incidents.filter(inc => {
      const status = inc.status.toLowerCase();
      return status === 'new';
    });
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

  // Listen for notification clicks from header
  useEffect(() => {
    const handleNotificationClicked = (event: CustomEvent) => {
      handleNotificationClick(event.detail);
    };

    window.addEventListener('notification-clicked' as any, handleNotificationClicked);
    return () => {
      window.removeEventListener('notification-clicked' as any, handleNotificationClicked);
    };
  }, []);

  // Combine mock tickets with real tickets and incidents from Business User (real-time sync)
  // Filter out AI-only incidents that should not appear in support engineer view
  type DisplayItem = (Incident | Ticket) & { 
    type?: 'incident' | 'ticket' | 'service-request';
    timeline?: Array<{ status: string; timestamp: string; description: string }>;
  };

  const allIncidents: DisplayItem[] = [
    ...mockTickets.filter(t => t.type === 'incident') as DisplayItem[],
    ...incidents
      .filter(inc => !inc.isAIOnly)
      .map(inc => ({
        ...inc,
        type: 'incident' as const,
      })) as DisplayItem[],
    ...tickets.map(ticket => ({
      ...ticket,
      type: 'ticket' as const,
    })) as DisplayItem[]
  ];

  // Date filtering function
  function filterByDate(incident: DisplayItem) {
    if (dateFilter === 'all') return true;
    let created: Date;
    try {
      created = parseISO(incident.created);
      if (isNaN(created.getTime())) throw new Error();
    } catch {
      created = new Date(incident.created);
    }
    const now = new Date();
    if (dateFilter === 'week') {
      return created >= startOfWeek(now, { weekStartsOn: 1 });
    }
    if (dateFilter === 'month') {
      return created >= startOfMonth(now);
    }
    if (dateFilter === 'year') {
      return created >= startOfYear(now);
    }
    if (dateFilter === 'custom' && customStart && customEnd) {
      const start = parseISO(customStart);
      const end = addDays(parseISO(customEnd), 1);
      return isWithinInterval(created, { start, end });
    }
    return true;
  }

  // Filtered data for metrics and tickets
  const filteredData = allIncidents.filter(filterByDate);

  // Compute metrics from filteredData
  const openTickets = filteredData.filter(t => {
    const status = t.status.toLowerCase();
    return status === 'new' || status === 'in progress' || status === 'approved' || status === 'on hold';
  }).length;
  const resolvedTickets = filteredData.filter(t => {
    const status = t.status.toLowerCase();
    return status === 'resolved' || status === 'closed';
  }).length;
  const avgResolutionTime = (() => {
    const resolved = filteredData.filter(t => {
      const status = t.status.toLowerCase();
      return status === 'resolved' || status === 'closed';
    });
    if (resolved.length === 0) return 'N/A';
    return (2.5).toFixed(1) + 'h';
  })();
  const customerSatisfaction = '4.8';
  const escalationRate = filteredData.filter(t => {
    const status = t.status.toLowerCase();
    return status === 'escalated';
  }).length / (filteredData.length || 1) * 100;
  const resolutionAccuracy = '94%';

  // Calculate breakdown data for Open Tickets
  const calculateBreakdown = (items: DisplayItem[], isOpen: boolean) => {
    const relevantItems = items.filter(item => {
      const status = item.status.toLowerCase();
      return isOpen 
        ? (status === 'new' || status === 'in progress' || status === 'approved' || status === 'on hold')
        : (status === 'resolved' || status === 'closed');
    });

    const incidents = relevantItems.filter(item => item.type === 'incident');
    const serviceRequests = relevantItems.filter(item => item.type === 'ticket' || item.type === 'service-request');

    const countPriorities = (items: DisplayItem[]) => ({
      critical: items.filter(i => i.priority === 'critical').length,
      high: items.filter(i => i.priority === 'high').length,
      medium: items.filter(i => i.priority === 'medium').length,
      low: items.filter(i => i.priority === 'low').length,
    });

    return {
      incidents: {
        total: incidents.length,
        priorities: countPriorities(incidents),
      },
      serviceRequests: {
        total: serviceRequests.length,
        priorities: countPriorities(serviceRequests),
      },
    };
  };

  const openBreakdown = calculateBreakdown(filteredData, true);
  const resolvedBreakdown = calculateBreakdown(filteredData, false);

  // Metrics array using computed values
  const metrics = [
    { 
      title: 'Open Tickets', 
      value: openTickets.toString(), 
      change: 0, 
      icon: TicketIcon, 
      color: 'text-primary',
      onClick: () => setBreakdownModal('open')
    },
    { 
      title: 'Tickets Resolved', 
      value: resolvedTickets.toString(), 
      change: 0, 
      icon: CheckCircle, 
      color: 'text-success',
      onClick: () => setBreakdownModal('resolved')
    },
    { title: 'Avg Resolution Time', value: avgResolutionTime, change: 0, icon: Clock, color: 'text-warning' },
    { title: 'Customer Satisfaction', value: customerSatisfaction, change: 0, icon: Star, color: 'text-warning' },
    { title: 'Escalation Rate', value: escalationRate.toFixed(1) + '%', change: 0, icon: TrendingUp, color: 'text-destructive' },
    { title: 'Resolution Accuracy', value: resolutionAccuracy, change: 0, icon: Target, color: 'text-success' },
  ];

  // Date and status filtered for tickets/incidents section, sorted by most recent first
  const filteredIncidents = filteredData
    .filter(incident => statusFilter === "all" || incident.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.created).getTime();
      const dateB = new Date(b.created).getTime();
      return dateB - dateA;
    });

  const handleTicketClick = (ticket: DisplayItem) => {
    if ('timeline' in ticket && ticket.timeline) {
      setSelectedIncident(ticket as Incident);
    } else {
      setSelectedTicket(ticket as Ticket);
    }
  };

  const handleIncidentClick = (incident: DisplayItem) => {
    if ('timeline' in incident && incident.timeline) {
      setSelectedIncident(incident as Incident);
    } else {
      setSelectedTicket(incident as Ticket);
    }
  };

  const handleNotificationClick = (ticketId: string) => {
    const foundItem = allIncidents.find(t => t.id === ticketId);
    if (foundItem) {
      if ('timeline' in foundItem && foundItem.timeline) {
        setSelectedIncident(foundItem as Incident);
      } else {
        setSelectedTicket(foundItem as Ticket);
      }
    }
  };

  useEffect(() => {
    const handleNotificationClicked = (event: CustomEvent) => {
      handleNotificationClick(event.detail);
    };

    window.addEventListener('notification-clicked' as any, handleNotificationClicked);
    return () => {
      window.removeEventListener('notification-clicked' as any, handleNotificationClicked);
    };
  }, [allIncidents]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-green-100 text-green-700';
      case 'escalated':
        return 'bg-red-100 text-red-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'new':
      case 'pending-approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'waiting-for-user':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Support Engineer Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor tickets, incidents, and performance metrics
        </p>
      </div>

      {/* Date Filter UI */}
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={dateFilter} onValueChange={v => setDateFilter(v as any)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <span>to</span>
            <input
              type="date"
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        )}
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
            Assigned Tickets & Incidents ({filteredData.length})
          </CardTitle>
          <CardDescription>
            Click on a ticket/incident number to view detailed information (synced with Business User dashboard)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status Filter */}
          <div className="mb-4 flex items-center gap-2">
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
              Showing {filteredIncidents.length} of {filteredData.length} tickets & incidents
            </span>
          </div>

          <div className="space-y-3">
            {filteredIncidents.map((ticket) => {
              const isIncident = 'timeline' in ticket;
              return (
                <div
                  key={ticket.id}
                  className={`border border-border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-yellow-50`}
                  onClick={() => {
                    const isIncident = 'timeline' in ticket && ticket.timeline;
                    if (isIncident) {
                      handleIncidentClick(ticket);
                    } else {
                      handleTicketClick(ticket);
                    }
                  }}
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
                      {(ticket.type === 'ticket' || ticket.type === 'service-request') && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          <TicketIcon className="h-3 w-3 mr-1" />
                          SR Ticket
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

      {/* Ticket Breakdown Modal */}
      <TicketBreakdownModal
        open={breakdownModal === 'open'}
        onClose={() => setBreakdownModal(null)}
        title="Open Tickets Breakdown"
        data={openBreakdown}
      />
      <TicketBreakdownModal
        open={breakdownModal === 'resolved'}
        onClose={() => setBreakdownModal(null)}
        title="Resolved Tickets Breakdown"
        data={resolvedBreakdown}
      />
    </div>
  );
}