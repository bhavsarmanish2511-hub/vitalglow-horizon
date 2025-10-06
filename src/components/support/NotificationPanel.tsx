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

interface NotificationPanelProps {
  onNotificationClick: (ticketId: string) => void;
}

export function NotificationPanel({ onNotificationClick }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { incidents } = useTickets();

  // Listen for approval notifications from incidents
  useEffect(() => {
    incidents.forEach(incident => {
      if (incident.approvalStatus === 'approved') {
        const approvalNotification: Notification = {
          id: `approval-${incident.id}`,
          title: 'Approval Received',
          message: `Approval for ticket ${incident.id} has been received from andrews@intelletica.com`,
          timestamp: new Date().toLocaleString(),
          read: false,
          type: 'resolved',
          ticketId: incident.id
        };

        // Check if notification already exists
        setNotifications(prev => {
          const exists = prev.some(n => n.id === approvalNotification.id);
          if (!exists) {
            return [approvalNotification, ...prev];
          }
          return prev;
        });
      }
    });
  }, [incidents]);

  // Listen for ticket resolution notifications (for business users)
  useEffect(() => {
    const handleTicketResolved = (event: CustomEvent) => {
      const { incidentId, srId, title } = event.detail;
      const resolutionNotification: Notification = {
        id: `resolution-${incidentId}`,
        title: 'Ticket Resolved',
        message: `Your request "${title}" has been resolved and closed.`,
        timestamp: new Date().toLocaleString(),
        read: false,
        type: 'resolved',
        ticketId: srId || incidentId
      };

      setNotifications(prev => {
        const exists = prev.some(n => n.id === resolutionNotification.id);
        if (!exists) {
          return [resolutionNotification, ...prev];
        }
        return prev;
      });
    };

    window.addEventListener('ticket-resolved' as any, handleTicketResolved);
    return () => {
      window.removeEventListener('ticket-resolved' as any, handleTicketResolved);
    };
  }, []);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Navigate to ticket if available
    if (notification.ticketId) {
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
      <DropdownMenuContent align="end" className="w-80">
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
                className="flex flex-col items-start gap-1 p-4 cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
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
