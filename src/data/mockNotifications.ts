export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'update' | 'escalation' | 'resolved';
  ticketId?: string;
}

export const mockNotifications: Notification[] = [];
