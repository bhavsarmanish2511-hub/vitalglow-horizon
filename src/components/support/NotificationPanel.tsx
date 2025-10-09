import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockNotifications, Notification } from '@/data/mockNotifications';
import { useTickets } from '@/contexts/TicketsContext';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationPanelProps {
  onNotificationClick: (ticketId: string) => void;
}

export function NotificationPanel({ onNotificationClick }: NotificationPanelProps) {
  const { user } = useAuth();
  const userRole = user?.role || 'business';
  const storageKey = `notifications_${user?.email || 'guest'}`;
  const notifiedIncidentsKey = `notified_incidents_${user?.email || 'guest'}`;
  
  // Load notifications from localStorage on mount
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : mockNotifications;
  });
  
  const { incidents } = useTickets();

  // Check for new incidents on mount for support engineers
  useEffect(() => {
    if (userRole !== 'support') return;

    const notifiedIncidents = JSON.parse(localStorage.getItem(notifiedIncidentsKey) || '[]');
    
    incidents.forEach(incident => {
      // Skip AI-only incidents (like Password Unlock)
      if (incident.isAIOnly) return;
      
      if (!notifiedIncidents.includes(incident.id)) {
        const notificationId = `incident-${incident.id}-${Date.now()}`;
        
        setNotifications(prev => {
          const exists = prev.some(n => n.ticketId === incident.id && n.type === 'assignment');
          if (exists) return prev;
          
          const newNotification: Notification = {
            id: notificationId,
            title: 'New Incident Assigned',
            message: `${incident.id}: ${incident.title} has been assigned to you`,
            timestamp: new Date().toLocaleString(),
            read: false,
            type: 'assignment',
            ticketId: incident.id
          };
          return [newNotification, ...prev];
        });

        notifiedIncidents.push(incident.id);
      }
    });

    localStorage.setItem(notifiedIncidentsKey, JSON.stringify(notifiedIncidents));
  }, [incidents, userRole, notifiedIncidentsKey]);

  // Persist notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, storageKey]);

  // Listen for new tickets/incidents (for support engineer ONLY)
  useEffect(() => {
    if (userRole !== 'support') return;

  const handleNewTicket = (event: CustomEvent) => {
    const { ticket, type } = event.detail;
    
    // Skip AI-only incidents (like Password Unlock)
    if (ticket.isAIOnly) return;
    
    const notificationId = `${type}-${ticket.id}-${Date.now()}`;
    const notifiedIncidents = JSON.parse(localStorage.getItem(notifiedIncidentsKey) || '[]');
    
    setNotifications(prev => {
      const priorityText = ticket.priority ? ` | Priority: ${ticket.priority.toUpperCase()}` : '';
      const categoryText = ticket.category ? ` | Category: ${ticket.category}` : '';
      
      const newNotification: Notification = {
        id: notificationId,
        title: type === 'incident' ? 'New Incident Assigned' : 'New Service Request Assigned',
        message: `${ticket.id}: ${ticket.title}${priorityText}${categoryText} - Assigned by: ${ticket.createdBy || 'Business User'}`,
        timestamp: new Date().toLocaleString(),
        read: false,
        type: 'assignment',
        ticketId: ticket.id
      };
      
      if (!notifiedIncidents.includes(ticket.id)) {
        notifiedIncidents.push(ticket.id);
        localStorage.setItem(notifiedIncidentsKey, JSON.stringify(notifiedIncidents));
      }
      
      return [newNotification, ...prev];
    });
  };

    window.addEventListener('support-ticket-created' as any, handleNewTicket);
    return () => {
      window.removeEventListener('support-ticket-created' as any, handleNewTicket);
    };
  }, [userRole, notifiedIncidentsKey]);

  // Listen for support engineer actions (for business user)
  useEffect(() => {
    const handleSupportAction = (event: CustomEvent) => {
      const { ticketId, action, message } = event.detail;
      const actionNotification: Notification = {
        id: `action-${ticketId}-${Date.now()}`,
        title: action,
        message: message,
        timestamp: new Date().toLocaleString(),
        read: false,
        type: 'update',
        ticketId: ticketId
      };

      setNotifications(prev => [actionNotification, ...prev]);
    };

    window.addEventListener('support-action' as any, handleSupportAction);
    return () => {
      window.removeEventListener('support-action' as any, handleSupportAction);
    };
  }, []);

  // Listen for ticket/incident creation (for business user ONLY)
  useEffect(() => {
    if (userRole !== 'business') return;

    const handleTicketCreated = (event: CustomEvent) => {
      const { ticket, type } = event.detail;
      const notificationId = `created-${ticket.id}-${Date.now()}`;
      
      setNotifications(prev => {
        const exists = prev.some(n => n.ticketId === ticket.id && n.title.includes('Created'));
        if (exists) return prev;
        
        const creationNotification: Notification = {
          id: notificationId,
          title: `${type === 'incident' ? 'Incident' : 'Service Request'} Created`,
          message: `${ticket.id}: ${ticket.title} has been created`,
          timestamp: new Date().toLocaleString(),
          read: false,
          type: 'assignment',
          ticketId: ticket.id
        };
        return [creationNotification, ...prev];
      });
    };

    window.addEventListener('ticket-created' as any, handleTicketCreated);
    return () => {
      window.removeEventListener('ticket-created' as any, handleTicketCreated);
    };
  }, [userRole]);

  // Listen for ticket resolution notifications (for business users ONLY)
  useEffect(() => {
    if (userRole !== 'business') return;

    const handleTicketResolved = (event: CustomEvent) => {
      const { incidentId, srId, title } = event.detail;
      const notificationId = `resolution-${incidentId || srId}-${Date.now()}`;
      
      setNotifications(prev => {
        const ticketId = srId || incidentId;
        const exists = prev.some(n => n.ticketId === ticketId && n.type === 'resolved');
        if (exists) return prev;
        
        const resolutionNotification: Notification = {
          id: notificationId,
          title: 'Ticket Resolved',
          message: `Your request "${title}" has been resolved and closed.`,
          timestamp: new Date().toLocaleString(),
          read: false,
          type: 'resolved',
          ticketId: ticketId
        };
        return [resolutionNotification, ...prev];
      });
    };

    window.addEventListener('ticket-resolved' as any, handleTicketResolved);
    return () => {
      window.removeEventListener('ticket-resolved' as any, handleTicketResolved);
    };
  }, [userRole]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    if (notification.ticketId) {
      window.dispatchEvent(new CustomEvent('notification-clicked', { 
        detail: notification.ticketId 
      }));
      onNotificationClick(notification.ticketId);
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'assignment':
        return 'bg-primary/10 text-primary';
      case 'escalation':
        return 'bg-destructive/10 text-destructive';
      case 'update':
        return 'bg-warning/10 text-warning';
      case 'resolved':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white shadow-lg">
  <DropdownMenuLabel className="flex items-center justify-between">
    <span>Notifications</span>
    {unreadCount > 0 && (
      <Badge variant="secondary">{unreadCount} new</Badge>
    )}
  </DropdownMenuLabel>
  <DropdownMenuSeparator />
  <ScrollArea className="h-[400px]">
    {notifications.length === 0 ? (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No notifications
      </div>
    ) : (
      notifications.map((notification) => (
        <DropdownMenuItem
          key={notification.id}
          className={`flex flex-col items-start gap-1 p-4 cursor-pointer transition-colors group
            ${!notification.read 
              ? 'bg-destructive/5 hover:bg-destructive/10 focus:bg-destructive/10' 
              : 'bg-muted/30 hover:bg-muted/50 focus:bg-muted/50'
            }`}
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="flex items-start justify-between w-full gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p
                  className={`font-medium text-sm transition-colors
                    ${!notification.read ? 'text-foreground font-semibold' : 'text-muted-foreground'}
                    group-hover:text-foreground`}
                >
                  {notification.title}
                </p>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                )}
              </div>
              <p className={`text-xs mt-1 transition-colors ${!notification.read ? 'text-foreground' : 'text-muted-foreground'} group-hover:text-foreground`}>
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-2 transition-colors group-hover:text-foreground">
                {notification.timestamp}
              </p>
            </div>
            <Badge className={getTypeColor(notification.type)} variant="outline">
              {notification.type}
            </Badge>
          </div>
        </DropdownMenuItem>
      ))
    )}
  </ScrollArea>
</DropdownMenuContent>
    </DropdownMenu>
  );
}