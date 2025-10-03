export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'update' | 'escalation' | 'resolved';
  ticketId?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Critical Incident Assigned',
    message: 'INC-001: Sensitive Payroll Data Access has been assigned to you',
    timestamp: '2024-01-15 09:35',
    read: false,
    type: 'assignment',
    ticketId: 'INC-001'
  },
  {
    id: 'notif-2',
    title: 'Ticket Updated',
    message: 'SR-103: Email Sync Problem has been updated with new information',
    timestamp: '2024-01-15 13:45',
    read: false,
    type: 'update',
    ticketId: 'SR-103'
  },
  {
    id: 'notif-3',
    title: 'Incident Escalated',
    message: 'INC-004: Database Performance Degradation has been escalated to DBA team',
    timestamp: '2024-01-15 15:30',
    read: false,
    type: 'escalation',
    ticketId: 'INC-004'
  },
  {
    id: 'notif-4',
    title: 'VPN Issue Assigned',
    message: 'SR-102: VPN Connection Issues requires your attention',
    timestamp: '2024-01-15 14:20',
    read: true,
    type: 'assignment',
    ticketId: 'SR-102'
  }
];
