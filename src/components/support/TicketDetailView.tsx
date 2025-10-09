import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  User, 
  AlertCircle, 
  FileText, 
  Activity,
  CheckCircle,
  TrendingUp,
  Edit,
  Send,
  CheckCheck,
  Lightbulb
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Ticket as TicketContextType, useTickets } from "@/contexts/TicketsContext";

// Finance Approval Button Component
function FinanceApprovalButton({ localTicket, setLocalTicket, toast }: any) {
  const [isApproving, setIsApproving] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved'>('pending');

  const handleSendForApproval = async () => {
    setIsApproving(true);
    setApprovalStatus('pending');

    toast({
      title: "Sending for Manager Approval",
      description: "Requesting approval from finance manager...",
    });

    // Simulate approval process - 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    setApprovalStatus('approved');
    setIsApproving(false);

    const now = new Date().toLocaleString();
    setLocalTicket({
      ...localTicket,
      approvalStatus: 'approved',
      updated: now,
      worklog: [
        ...(localTicket.worklog || []),
        {
          timestamp: now,
          action: 'Manager approval requested',
          author: 'Support Engineer'
        },
        {
          timestamp: now,
          action: 'Manager approval granted - Financial report access authorized',
          author: 'Finance Manager'
        }
      ]
    });

    toast({
      title: "Approval Granted",
      description: "Finance manager has approved the request. You can now provide the resolution.",
    });
  };

  return (
    <Button 
      className="flex-1" 
      onClick={handleSendForApproval}
      disabled={isApproving || approvalStatus === 'approved'}
    >
      {isApproving && approvalStatus === 'pending' && "Waiting for Approval..."}
      {!isApproving && approvalStatus === 'pending' && "Send for Manager Approval"}
      {approvalStatus === 'approved' && "✓ Approved"}
    </Button>
  );
}

// Use a local interface that extends the ticket from context
interface Ticket extends Partial<TicketContextType> {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
  updated: string;
  category: string;
  createdBy?: string;
  slaTimer?: string;
  chatHistory?: any[];
  comments?: Array<{ author: string; content: string; timestamp: string }>;
  resolution?: string;
  resolvedBy?: string;
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

interface TicketDetailViewProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
}

export function TicketDetailView({ ticket, open, onClose }: TicketDetailViewProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resolutionSteps, setResolutionSteps] = useState('');
  const [resolutionSent, setResolutionSent] = useState(false);
  const [localTicket, setLocalTicket] = useState<Ticket>(ticket);
  const [resolutionLink, setResolutionLink] = useState('');
  const { toast } = useToast();
  const { updateTicket: updateGlobalTicket } = useTickets();

  const handleExecuteWorkflow = () => {
    setIsExecuting(true);
    
    setTimeout(() => {
      setIsExecuting(false);
      toast({
        title: "Worklog Updated Successfully",
        description: "The incident worklog has been updated with the recommended fix.",
      });
    }, 2000);
  };

  const handleAddUpdate = () => {
    setIsEditing(true);
  };

  const handleSaveResolution = () => {
    if (!resolutionSteps.trim()) {
      toast({
        title: "Error",
        description: "Please provide resolution steps before saving.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toLocaleString();
    const updatedWorklog = [
      ...(localTicket.worklog || []),
      {
        timestamp: now,
        action: `Resolution steps added: ${resolutionSteps}`,
        author: 'martha@intelletica.com'
      }
    ];

    setLocalTicket({
      ...localTicket,
      worklog: updatedWorklog,
      updated: now
    });

    // Dispatch notification event for business user
    window.dispatchEvent(new CustomEvent('support-action', {
      detail: {
        ticketId: localTicket.id,
        action: 'Resolution Steps Added',
        message: `Support engineer added resolution steps for ${localTicket.id}`
      }
    }));

    setIsEditing(false);
    toast({
      title: "Resolution Saved",
      description: "Resolution steps have been added to the worklog.",
    });
  };

  // const handleSendToUser = () => {
  //   if (!resolutionSteps.trim()) {
  //     toast({
  //       title: "Error",
  //       description: "Please save resolution steps before sending to user.",
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   const now = new Date().toLocaleString();
  //   const updatedWorklog = [
  //     ...(localTicket.worklog || []),
  //     {
  //       timestamp: now,
  //       action: `Resolution sent to user (${localTicket.createdBy}): Password reset link and instructions provided by SMS`,
  //       author: 'System'
  //     },
  //     {
  //       timestamp: now,
  //       action: 'SMS delivered successfully to user with password reset instructions',
  //       author: 'System'
  //     }
  //   ];

  //   setLocalTicket({
  //     ...localTicket,
  //     worklog: updatedWorklog,
  //     status: 'waiting-for-user',
  //     updated: now
  //   });

  //   setResolutionSent(true);
    
  //   // Dispatch notification event for business user
  //   window.dispatchEvent(new CustomEvent('support-action', {
  //     detail: {
  //       ticketId: localTicket.id,
  //       action: 'Resolution Sent',
  //       message: `Password reset instructions sent for ${localTicket.id}`
  //     }
  //   }));

  //   toast({
  //     title: "Resolution Sent",
  //     description: `Password reset instructions sent to ${localTicket.createdBy}`,
  //   });

  //   // Simulate user resetting password after 3 seconds
  //   setTimeout(() => {
  //     const userActionTime = new Date().toLocaleString();
  //     const finalWorklog = [
  //       ...updatedWorklog,
  //       {
  //         timestamp: userActionTime,
  //         action: 'User successfully reset password and logged in',
  //         author: 'System'
  //       }
  //     ];

  //     setLocalTicket(prev => ({
  //       ...prev,
  //       worklog: finalWorklog,
  //       status: 'resolved',
  //       updated: userActionTime
  //     }));

  //     // Dispatch notification for ticket resolution
  //     window.dispatchEvent(new CustomEvent('support-action', {
  //       detail: {
  //         ticketId: localTicket.id,
  //         action: 'Ticket Resolved',
  //         message: `${localTicket.id}: ${localTicket.title} has been resolved`
  //       }
  //     }));

  //     toast({
  //       title: "User Action Completed",
  //       description: "User has successfully reset their password.",
  //     });
  //   }, 8000);
  // };

  const handleSendToUser = async () => {
    if (!resolutionSteps.trim()) {
      toast({
        title: "Error",
        description: "Please save resolution steps before sending to user.",
        variant: "destructive"
      });
      return;
    }
  
    const now = new Date().toLocaleString();
  
    // Step 1: Add the first worklog entry
    const firstWorklog = [
      ...(localTicket.worklog || []),
      {
        timestamp: now,
        action: `Resolution sent to user (${localTicket.createdBy}): Password reset link and instructions provided over SMS`,
        author: 'System'
      }
    ];
  
    setLocalTicket({
      ...localTicket,
      worklog: firstWorklog,
      status: 'waiting-for-user',
      updated: now
    });
  
    setResolutionSent(true);
  
    // Dispatch notification event for business user
    window.dispatchEvent(new CustomEvent('support-action', {
      detail: {
        ticketId: localTicket.id,
        action: 'Resolution Sent',
        message: `Password reset instructions sent for ${localTicket.id}`
      }
    }));
  
    toast({
      title: "Resolution Sent",
      description: `Password reset instructions sent to ${localTicket.createdBy}`,
    });
  
    // Step 2: Wait 4 seconds before adding the "Email delivered" entry
    await new Promise(resolve => setTimeout(resolve, 4000));
    const emailDeliveredTime = new Date().toLocaleString();
  
    const secondWorklog = [
      ...firstWorklog,
      {
        timestamp: emailDeliveredTime,
        action: 'Msg delivered successfully to user with password reset instructions',
        author: 'System'
      }
    ];
  
    setLocalTicket(prev => ({
      ...prev,
      worklog: secondWorklog,
      updated: emailDeliveredTime
    }));
  
    // Step 3: Simulate user resetting password after 8 seconds from now
    setTimeout(() => {
      const userActionTime = new Date().toLocaleString();
      const finalWorklog = [
        ...secondWorklog,
        {
          timestamp: userActionTime,
          action: 'User successfully reset password and logged in',
          author: 'System'
        }
      ];
  
      setLocalTicket(prev => ({
        ...prev,
        worklog: finalWorklog,
        status: 'resolved',
        updated: userActionTime
      }));
  
      // Dispatch notification for ticket resolution
      window.dispatchEvent(new CustomEvent('support-action', {
        detail: {
          ticketId: localTicket.id,
          action: 'Ticket Resolved',
          message: `${localTicket.id}: ${localTicket.title} has been resolved`
        }
      }));
  
      toast({
        title: "User Action Completed",
        description: "User has successfully reset their password.",
      });
    }, 8000); // 8 seconds after the "Email delivered" entry
  };

  // const handleResolveTicket = () => {
  //   if (!resolutionLink.trim()) {
  //     toast({
  //       title: "Error",
  //       description: "Please provide a resolution link before resolving.",
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   const now = new Date().toLocaleString();
  //   const updatedTicket = {
  //     ...localTicket,
  //     status: "resolved" as const,
  //     resolution: resolutionLink,
  //     resolvedBy: "martha@intelletica.com",
  //     updated: now,
  //     comments: [
  //       ...(localTicket.comments || []),
  //       { 
  //         author: "Support Engineer", 
  //         content: `Resolution provided: ${resolutionLink}`,
  //         timestamp: now 
  //       }
  //     ]
  //   };

  //   setLocalTicket(updatedTicket);
  //   updateGlobalTicket(localTicket.id, updatedTicket);

  //   // Dispatch notification event for business user
  //   window.dispatchEvent(new CustomEvent('ticket-resolved', {
  //     detail: {
  //       ticketId: localTicket.id,
  //       ticket: updatedTicket,
  //       action: 'Ticket Resolved',
  //       message: `${localTicket.id} has been resolved. Resolution link provided.`
  //     }
  //   }));

  //   toast({
  //     title: "Ticket Resolved",
  //     description: "Resolution has been sent to the user. They can now close the ticket.",
  //   });

  //   setTimeout(() => {
  //     onClose();
  //   }, 1500);
  // };

  const handleResolveTicket = () => {
    if (!resolutionLink.trim()) {
      toast({
        title: "Error",
        description: "Please provide a resolution link before resolving.",
        variant: "destructive"
      });
      return;
    }
  
    const now = new Date().toLocaleString();
  
    // Add a worklog entry for resolution
    const updatedWorklog = [
      ...(localTicket.worklog || []),
      {
        timestamp: now,
        action: `Ticket resolved. Resolution link provided: ${resolutionLink}`,
        author: "Support Engineer"
      }
    ];
  
    const updatedTicket = {
      ...localTicket,
      status: "resolved" as const,
      resolution: resolutionLink,
      resolvedBy: "martha@intelletica.com",
      updated: now,
      worklog: updatedWorklog,
      comments: [
        ...(localTicket.comments || []),
        { 
          author: "Support Engineer", 
          content: `Resolution provided: ${resolutionLink}`,
          timestamp: now 
        }
      ]
    };
  
    setLocalTicket(updatedTicket);
    updateGlobalTicket(localTicket.id, updatedTicket);
  
    // Dispatch notification event for business user
    window.dispatchEvent(new CustomEvent('ticket-resolved', {
      detail: {
        ticketId: localTicket.id,
        ticket: updatedTicket,
        action: 'Ticket Resolved',
        message: `${localTicket.id} has been resolved. Resolution link provided.`
      }
    }));
  
    toast({
      title: "Ticket Resolved",
      description: "Resolution has been sent to the user. They can now close the ticket.",
    });
  
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleCloseTicket = () => {
    toast({
      title: "Ticket Closed",
      description: "The incident has been successfully closed.",
    });

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 flex flex-col gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <DialogTitle className="text-2xl">{localTicket.title}</DialogTitle>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="font-mono">{localTicket.id}</Badge>
            <Badge className={
              localTicket.status === "resolved" 
                ? "bg-success/10 text-success" 
                : localTicket.status === "escalated"
                ? "bg-destructive/10 text-destructive"
                : localTicket.status === "waiting-for-user"
                ? "bg-muted/50 text-muted-foreground"
                : "bg-primary/10 text-primary"
            }>
              {localTicket.status.replace("-", " ")}
            </Badge>
            <Badge className={
              localTicket.priority === "critical" || localTicket.priority === "high" 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-warning text-warning-foreground"
            }>
              {localTicket.priority} priority
            </Badge>
            <Badge variant="outline">{localTicket.category}</Badge>
            {localTicket.slaTimer && (
              <Badge variant="outline" className="text-warning">
                <Clock className="h-3 w-3 mr-1" />
                {localTicket.slaTimer}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="space-y-6 mt-4">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{localTicket.description}</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-medium text-foreground">{localTicket.assignee}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Created By</p>
                  <p className="font-medium text-foreground">{localTicket.createdBy}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">{localTicket.created}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-foreground">{localTicket.updated}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Resolution Editor */}
            {isEditing && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Edit className="h-4 w-4 text-primary" />
                    {localTicket.category === "Finance" ? "Provide Resolution Link" : "Add Resolution Steps"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {localTicket.category === "Finance" ? (
                    <div>
                      <Label htmlFor="resolutionLink">Resolution Link (SharePoint/Download URL)</Label>
                      <Textarea
                        id="resolutionLink"
                        placeholder="Enter the SharePoint or download link for the financial report..."
                        value={resolutionLink}
                        onChange={(e) => setResolutionLink(e.target.value)}
                        className="min-h-[80px] mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Provide the secure link to the requested financial report document.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="resolution">Resolution Steps for User</Label>
                      <Textarea
                        id="resolution"
                        placeholder="Enter step-by-step instructions for the user to reset their password..."
                        value={resolutionSteps}
                        onChange={(e) => setResolutionSteps(e.target.value)}
                        className="min-h-[120px] mt-2"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    {localTicket.category === "Finance" ? (
                      <Button onClick={handleResolveTicket} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve Ticket
                      </Button>
                    ) : (
                      <Button onClick={handleSaveResolution} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Resolution
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Send Resolution to User */}
            {!isEditing && resolutionSteps && !resolutionSent && (
              <Card className="bg-success/5 border-success/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Send className="h-4 w-4 text-success" />
                    Send Resolution to User
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">Resolution steps are ready to be sent to the user.</p>
                  <Button onClick={handleSendToUser} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Password Reset Instructions to User
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Similar Incidents */}
            {localTicket.similarIncidents && localTicket.similarIncidents.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Similar Incidents ({localTicket.similarIncidents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {localTicket.similarIncidents.map((incident) => (
                    <div key={incident.id} className="p-3 bg-card rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{incident.id}</Badge>
                        <p className="font-medium text-sm">{incident.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <strong>Resolution:</strong> {incident.resolution}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* SOPs */}
            {localTicket.sops && localTicket.sops.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Standard Operating Procedures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {localTicket.sops.map((sop, index) => (
                    <div key={index} className="p-4 bg-card rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">{sop.title}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={sop.confidence} className="w-20 h-2" />
                          <span className="text-sm text-muted-foreground">{sop.confidence}%</span>
                        </div>
                      </div>
                      <ol className="space-y-2 text-sm">
                        {sop.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex gap-2">
                            <span className="text-muted-foreground">{stepIndex + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* MELT Data */}
            {localTicket.meltData && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    MELT Data (Incident Time Window)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">CPU Usage</p>
                      <div className="flex items-center gap-2">
                        <Progress value={localTicket.meltData.cpuUsage} className="flex-1" />
                        <span className="text-sm font-medium">{localTicket.meltData.cpuUsage}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Memory Usage</p>
                      <div className="flex items-center gap-2">
                        <Progress value={localTicket.meltData.memoryUsage} className="flex-1" />
                        <span className="text-sm font-medium">{localTicket.meltData.memoryUsage}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Error Rate</p>
                      <div className="flex items-center gap-2">
                        <Progress value={localTicket.meltData.errorRate * 100} className="flex-1" />
                        <span className="text-sm font-medium">{localTicket.meltData.errorRate}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Similar Incidents - Finance Category */}
            {localTicket.category === "Finance" && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Similar Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-card rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">SR12340</Badge>
                      <p className="font-medium text-sm">Quarterly Sales Report Access</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong>Resolution:</strong> Report provided via SharePoint link
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">INC56786</Badge>
                      <p className="font-medium text-sm">Sensitive Financial Data Access</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong>Resolution:</strong> Secure download link provided after approval
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Standard Operating Procedures - Finance Category */}
            {localTicket.category === "Finance" && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Standard Operating Procedures (SOPs)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-card rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium">Financial Report Request Process</p>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">95%</span>
                      </div>
                    </div>
                    <ol className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">1.</span>
                        <span>Verify user authorization and access level</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">2.</span>
                        <span>Validate report type and time period requested</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">3.</span>
                        <span>Check if manager approval is required (reports &gt; $100K)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">4.</span>
                        <span>Generate report from financial database</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">5.</span>
                        <span>Upload to secure SharePoint location</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">6.</span>
                        <span>Provide secure download link to requestor</span>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Fix from ServiceNow - Finance Category */}
            {localTicket.category === "Finance" && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Recommended Fix from ServiceNow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">Automated Resolution Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Verify user access permissions in Finance system</li>
                      <li>Extract requested financial data from database</li>
                      <li>Generate PDF/Excel report with appropriate formatting</li>
                      <li>Upload report to SharePoint secure folder</li>
                      <li>Generate time-limited download link (valid for 48 hours)</li>
                      <li>Send link to user via secure email</li>
                      <li>Log access request in compliance audit trail</li>
                    </ol>
                    <Badge className="mt-2 bg-success/10 text-success">Confidence: 92%</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Worklog */}
            {localTicket.worklog && localTicket.worklog.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Work Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {localTicket.worklog.map((entry, index) => (
                      <div key={index} className="flex gap-3 pb-3 border-b last:border-b-0">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          {index < localTicket.worklog!.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{entry.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.author} • {entry.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-3 px-6 py-4 border-t mt-0 bg-background">
          {localTicket.category === "Finance" && !isEditing && !resolutionLink && localTicket.status !== 'resolved' && !localTicket.approvalStatus && (
            <FinanceApprovalButton 
              localTicket={localTicket}
              setLocalTicket={setLocalTicket}
              toast={toast}
            />
          )}
          {!isEditing && !resolutionSteps && !resolutionLink && localTicket.status !== 'resolved' && (localTicket.category !== "Finance" || localTicket.approvalStatus === 'approved') && (
            <Button variant="outline" className="flex-1" onClick={handleAddUpdate}>
              <Edit className="h-4 w-4 mr-2" />
              {localTicket.category === "Finance" ? "Provide Resolution" : "Add Update"}
            </Button>
          )}
          {localTicket.status === 'resolved' && localTicket.category !== "Finance" && (
            <Button className="flex-1" onClick={handleCloseTicket}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Resolve
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
