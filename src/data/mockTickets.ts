export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'escalated' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  createdBy: string;
  created: string;
  updated: string;
  category: string;
  type: 'incident' | 'service-request';
  slaTimer?: string;
  similarIncidents?: Array<{
    id: string;
    title: string;
    resolution: string;
  }>;
  sops?: Array<{
    title: string;
    confidence: number;
    steps: string[];
  }>;
  meltData?: {
    cpuUsage: number;
    memoryUsage: number;
    errorRate: number;
  };
  recommendedFix?: string;
  worklog?: Array<{
    timestamp: string;
    action: string;
    author: string;
  }>;
}

export const mockTickets: Ticket[] = [
  {
    id: 'INC-001',
    title: 'Sensitive Payroll Data Access - Incident from Business User',
    description: 'Incident created for accessing sensitive payroll information requested by james@fincompany.com',
    status: 'in-progress',
    priority: 'critical',
    assignee: 'martha@intelletica.com',
    createdBy: 'james@fincompany.com',
    created: '2024-01-15 09:31',
    updated: '2024-01-15 15:45',
    category: 'Security',
    type: 'incident',
    slaTimer: '2h 15m remaining',
    similarIncidents: [
      {
        id: 'INC-892',
        title: 'Payroll Access Request - Q3',
        resolution: 'Verified user credentials and granted temporary access with audit logging enabled'
      },
      {
        id: 'INC-756',
        title: 'Financial Data Access Issue',
        resolution: 'Reset user permissions and provided secure access link'
      }
    ],
    sops: [
      {
        title: 'Payroll Access Standard Procedure',
        confidence: 95,
        steps: [
          'Verify user identity through SSO',
          'Check user authorization level',
          'Enable audit logging for session',
          'Grant temporary access (4 hours)',
          'Send notification to compliance team'
        ]
      },
      {
        title: 'Sensitive Data Handling Protocol',
        confidence: 88,
        steps: [
          'Confirm manager approval',
          'Enable enhanced security monitoring',
          'Create access token with expiration',
          'Log all data queries'
        ]
      }
    ],
    meltData: {
      cpuUsage: 45,
      memoryUsage: 62,
      errorRate: 0.02
    },
    recommendedFix: 'Execute Payroll Access Standard Procedure with enhanced logging. Estimated resolution time: 30 minutes.',
    worklog: [
      {
        timestamp: '2024-01-15 09:31',
        action: 'Incident created by AI Assistant',
        author: 'System'
      },
      {
        timestamp: '2024-01-15 09:35',
        action: 'Assigned to Support Engineer',
        author: 'System'
      },
      {
        timestamp: '2024-01-15 10:00',
        action: 'SOP identified and recommended',
        author: 'AI Assistant'
      }
    ]
  },
  {
    id: 'SR-102',
    title: 'VPN Connection Issues',
    description: 'User unable to connect to company VPN from remote location',
    status: 'new',
    priority: 'high',
    assignee: 'martha@intelletica.com',
    createdBy: 'user@company.com',
    created: '2024-01-15 14:20',
    updated: '2024-01-15 14:20',
    category: 'Network',
    type: 'service-request'
  },
  {
    id: 'SR-103',
    title: 'Email Sync Problem',
    description: 'Outlook not syncing emails for the past 2 hours',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'support@intelletica.com',
    createdBy: 'jane@company.com',
    created: '2024-01-15 11:00',
    updated: '2024-01-15 13:45',
    category: 'Email',
    type: 'service-request'
  },
  {
    id: 'INC-004',
    title: 'Database Performance Degradation',
    description: 'Production database showing slow query response times',
    status: 'escalated',
    priority: 'critical',
    assignee: 'dba-team@intelletica.com',
    createdBy: 'monitor@system.com',
    created: '2024-01-15 08:15',
    updated: '2024-01-15 15:30',
    category: 'Database',
    type: 'incident'
  },
  {
    id: 'SR-105',
    title: 'Software License Request',
    description: 'Request for Adobe Creative Cloud license for new employee',
    status: 'resolved',
    priority: 'low',
    assignee: 'licensing@intelletica.com',
    createdBy: 'hr@company.com',
    created: '2024-01-14 09:00',
    updated: '2024-01-15 10:30',
    category: 'Licensing',
    type: 'service-request'
  }
];
