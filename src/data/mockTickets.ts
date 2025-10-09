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

// Generate dates for different time periods
const now = new Date();
const getDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// This week (7 tickets)
const thisWeek = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(now);
  date.setDate(date.getDate() - i);
  return date;
});

// This month (15 tickets)
const thisMonth = Array.from({ length: 15 }, (_, i) => {
  const date = new Date(now);
  date.setDate(date.getDate() - (i * 2));
  return date;
});

// This year (20 tickets)
const thisYear = Array.from({ length: 20 }, (_, i) => {
  const date = new Date(now);
  date.setMonth(date.getMonth() - i);
  return date;
});

export const mockTickets: Ticket[] = [
  {
    id: 'INC325678',
    title: 'Account Locked - Unable to login to a Application',
    description: 'User account has been locked after 3 consecutive failed login attempts. User requires password reset to regain access to their account.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'martha@intelletica.com',
    createdBy: 'sarah.johnson@company.com',
    created: getDateString(thisWeek[0]),
    updated: getDateString(thisWeek[0]),
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
        timestamp: getDateString(thisWeek[0]),
        action: 'Incident created - Account locked after 3 failed login attempts',
        author: 'System'
      },
      {
        timestamp: getDateString(thisWeek[0]),
        action: 'Assigned to Support Engineer for resolution',
        author: 'System'
      },
      {
        timestamp: getDateString(thisWeek[0]),
        action: 'Identity verification initiated via phone',
        author: 'AI Assistant'
      },
      {
        timestamp: getDateString(thisWeek[0]),
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
    created: getDateString(thisWeek[1]),
    updated: getDateString(thisWeek[1]),
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
        timestamp: getDateString(thisWeek[1]),
        action: 'Incident created by AI Assistant',
        author: 'System'
      },
      {
        timestamp: getDateString(thisWeek[1]),
        action: 'Assigned to Support Engineer',
        author: 'System'
      },
      {
        timestamp: getDateString(thisWeek[1]),
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
    created: getDateString(thisWeek[2]),
    updated: getDateString(thisWeek[2]),
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
    created: getDateString(thisWeek[3]),
    updated: getDateString(thisWeek[3]),
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
    created: getDateString(thisWeek[4]),
    updated: getDateString(thisWeek[4]),
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
    created: getDateString(thisWeek[5]),
    updated: getDateString(thisWeek[5]),
    category: 'Infrastructure',
    type: 'incident'
  },
  {
    id: 'INC106789',
    title: 'Software License Expired',
    description: 'Team reporting inability to access licensed software',
    status: 'new',
    priority: 'medium',
    assignee: 'martha@intelletica.com',
    createdBy: 'team.lead@company.com',
    created: getDateString(thisWeek[6]),
    updated: getDateString(thisWeek[6]),
    category: 'Licensing',
    type: 'incident'
  },
  // This month additional tickets
  {
    id: 'INC107234',
    title: 'Printer Configuration Issue',
    description: 'Network printer not responding to print commands',
    status: 'in-progress',
    priority: 'low',
    assignee: 'martha@intelletica.com',
    createdBy: 'office@company.com',
    created: getDateString(thisMonth[7]),
    updated: getDateString(thisMonth[7]),
    category: 'Hardware',
    type: 'incident'
  },
  {
    id: 'SR108567',
    title: 'New Software Installation Request',
    description: 'Request to install Adobe Creative Suite for design team',
    status: 'new',
    priority: 'medium',
    assignee: 'martha@intelletica.com',
    createdBy: 'design@company.com',
    created: getDateString(thisMonth[8]),
    updated: getDateString(thisMonth[8]),
    category: 'Software',
    type: 'service-request'
  },
  {
    id: 'INC109876',
    title: 'Cloud Storage Sync Failure',
    description: 'OneDrive not syncing files to cloud',
    status: 'resolved',
    priority: 'medium',
    assignee: 'martha@intelletica.com',
    createdBy: 'sales@company.com',
    created: getDateString(thisMonth[9]),
    updated: getDateString(thisMonth[9]),
    category: 'Cloud Services',
    type: 'incident'
  },
  {
    id: 'SR110234',
    title: 'Access Request - HR Portal',
    description: 'New employee needs access to HR system',
    status: 'in-progress',
    priority: 'high',
    assignee: 'martha@intelletica.com',
    createdBy: 'hr@company.com',
    created: getDateString(thisMonth[10]),
    updated: getDateString(thisMonth[10]),
    category: 'Access Management',
    type: 'service-request'
  },
  {
    id: 'INC111567',
    title: 'Website Loading Slowly',
    description: 'Company website experiencing high load times',
    status: 'escalated',
    priority: 'critical',
    assignee: 'martha@intelletica.com',
    createdBy: 'webmaster@company.com',
    created: getDateString(thisMonth[11]),
    updated: getDateString(thisMonth[11]),
    category: 'Web Services',
    type: 'incident'
  },
  {
    id: 'INC112890',
    title: 'Mobile App Crash on iOS',
    description: 'Company mobile app crashes on startup for iOS users',
    status: 'new',
    priority: 'high',
    assignee: 'martha@intelletica.com',
    createdBy: 'mobile.user@company.com',
    created: getDateString(thisMonth[12]),
    updated: getDateString(thisMonth[12]),
    category: 'Mobile',
    type: 'incident'
  },
  {
    id: 'SR113456',
    title: 'Equipment Request - Monitor',
    description: 'Request for additional 27-inch monitor for workstation',
    status: 'waiting-for-user',
    priority: 'low',
    assignee: 'martha@intelletica.com',
    createdBy: 'developer@company.com',
    created: getDateString(thisMonth[13]),
    updated: getDateString(thisMonth[13]),
    category: 'Hardware',
    type: 'service-request'
  },
  {
    id: 'INC114789',
    title: 'Security Certificate Expiration Warning',
    description: 'SSL certificate for internal portal expiring in 7 days',
    status: 'in-progress',
    priority: 'high',
    assignee: 'martha@intelletica.com',
    createdBy: 'system@company.com',
    created: getDateString(thisMonth[14]),
    updated: getDateString(thisMonth[14]),
    category: 'Security',
    type: 'incident'
  },
  // This year additional tickets
  {
    id: 'SR115234',
    title: 'Office Relocation - IT Setup',
    description: 'Setup workstations and network for new office location',
    status: 'new',
    priority: 'medium',
    assignee: 'martha@intelletica.com',
    createdBy: 'facilities@company.com',
    created: getDateString(thisYear[15]),
    updated: getDateString(thisYear[15]),
    category: 'Infrastructure',
    type: 'service-request'
  },
  {
    id: 'INC116567',
    title: 'Backup System Failure',
    description: 'Automated backup process failed for critical databases',
    status: 'escalated',
    priority: 'critical',
    assignee: 'martha@intelletica.com',
    createdBy: 'system@company.com',
    created: getDateString(thisYear[16]),
    updated: getDateString(thisYear[16]),
    category: 'Database',
    type: 'incident'
  },
  {
    id: 'INC117890',
    title: 'Conference Room AV System Not Working',
    description: 'Display and audio system in conference room A not functioning',
    status: 'resolved',
    priority: 'medium',
    assignee: 'martha@intelletica.com',
    createdBy: 'office@company.com',
    created: getDateString(thisYear[17]),
    updated: getDateString(thisYear[17]),
    category: 'Hardware',
    type: 'incident'
  },
  {
    id: 'SR118456',
    title: 'Training Request - Security Awareness',
    description: 'Schedule security awareness training for all employees',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'martha@intelletica.com',
    createdBy: 'security@company.com',
    created: getDateString(thisYear[18]),
    updated: getDateString(thisYear[18]),
    category: 'Training',
    type: 'service-request'
  },
  {
    id: 'INC119789',
    title: 'Data Migration Issue',
    description: 'Legacy system data not migrating correctly to new platform',
    status: 'new',
    priority: 'high',
    assignee: 'martha@intelletica.com',
    createdBy: 'data.admin@company.com',
    created: getDateString(thisYear[19]),
    updated: getDateString(thisYear[19]),
    category: 'Database',
    type: 'incident'
  }
];
