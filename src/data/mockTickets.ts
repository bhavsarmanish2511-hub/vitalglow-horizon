export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'escalated' | 'resolved' | 'waiting-for-user';
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
    id: 'INC325678',
    title: 'Account Locked - Multiple Incorrect Login Attempts',
    description: 'User account has been locked after 3 consecutive failed login attempts. User requires password reset to regain access to their account.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'martha@intelletica.com',
    createdBy: 'sarah.johnson@company.com',
    created: '2024-01-15 16:20',
    updated: '2024-01-15 16:25',
    category: 'Security',
    type: 'incident',
    slaTimer: '3h 40m remaining',
    similarIncidents: [
      {
        id: 'INC-945102',
        title: 'Account Lockout - Failed Login',
        resolution: 'Reset password via secure link and verified user identity through secondary email'
      },
      {
        id: 'INC-823201',
        title: 'Multiple Failed Authentication Attempts',
        resolution: 'Unlocked account after identity verification and sent password reset instructions'
      },
      {
        id: 'INC-756507',
        title: 'User Lockout Due to Password Policy',
        resolution: 'Provided password reset link with temporary access code'
      }
    ],
    sops: [
      {
        title: 'Account Lockout Resolution Protocol',
        confidence: 97,
        steps: [
          'Verify user identity through alternative authentication method (email/phone)',
          'Check security logs for suspicious activity patterns',
          'Generate secure password reset link with 24-hour expiration',
          'Send password reset link to registered email address',
          'Monitor account for successful password reset completion',
          'Update incident worklog with resolution status'
        ]
      },
      {
        title: 'Security Incident Response - Account Access',
        confidence: 89,
        steps: [
          'Review failed login attempts timeline and source IPs',
          'Confirm no unauthorized access occurred',
          'Initiate password reset workflow',
          'Enable additional security monitoring for 48 hours',
          'Notify user via secure channel'
        ]
      }
    ],
    meltData: {
      cpuUsage: 32,
      memoryUsage: 48,
      errorRate: 0.15
    },
    recommendedFix: 'Execute Account Lockout Resolution Protocol. Generate and send password reset link to user\'s verified email address. Estimated resolution time: 15 minutes. System will auto-update worklog upon successful password reset.',
    worklog: [
      {
        timestamp: '2024-01-15 16:20',
        action: 'Incident created - Account locked after 5 failed login attempts',
        author: 'System'
      },
      {
        timestamp: '2024-01-15 16:22',
        action: 'Assigned to Support Engineer for resolution',
        author: 'System'
      },
      {
        timestamp: '2024-01-15 16:23',
        action: 'Identity verification initiated via phone',
        author: 'AI Assistant'
      },
      {
        timestamp: '2024-01-15 16:25',
        action: 'SOP matched with 97% confidence - Ready to execute password reset',
        author: 'AI Assistant'
      }
    ]
  },
  {
    id: 'INC324511',
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
    id: 'INC102456',
    title: 'VPN Connection Issues',
    description: 'User unable to connect to company VPN from remote location',
    status: 'new',
    priority: 'high',
    assignee: 'martha@intelletica.com',
    createdBy: 'user@company.com',
    created: '2024-01-15 14:20',
    updated: '2024-01-15 14:20',
    category: 'Network',
    type: 'incident'
  },
  {
    id: 'INC103789',
    title: 'Email Sync Problem',
    description: 'Outlook not syncing emails for the past 2 hours',
    status: 'waiting-for-user',
    priority: 'medium',
    assignee: 'martha@intelletica.com',
    createdBy: 'jane@company.com',
    created: '2024-01-15 11:00',
    updated: '2024-01-15 13:45',
    category: 'Email',
    type: 'incident'
  },
  {
    id: 'INC104321',
    title: 'Database Performance Degradation',
    description: 'Production database showing slow query response times',
    status: 'escalated',
    priority: 'critical',
    assignee: 'martha@intelletica.com',
    createdBy: 'monitor@system.com',
    created: '2024-01-15 08:15',
    updated: '2024-01-15 15:30',
    category: 'Database',
    type: 'incident'
  },
  {
    id: 'INC105654',
    title: 'Application Server Timeout',
    description: 'Application server experiencing timeout errors during peak hours',
    status: 'resolved',
    priority: 'high',
    assignee: 'martha@intelletica.com',
    createdBy: 'monitor@system.com',
    created: '2024-01-14 09:00',
    updated: '2024-01-15 10:30',
    category: 'Infrastructure',
    type: 'incident'
  }
];
