import { useState, useEffect } from 'react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  User, 
  AlertCircle, 
  FileText,
  Mail,
  Link as LinkIcon,
  CheckCircle,
  X,
  BookOpen,
  Database,
  Lightbulb
} from "lucide-react";
import { Incident } from "@/contexts/TicketsContext";
import { useToast } from "@/hooks/use-toast";
import { useTickets } from "@/contexts/TicketsContext";

interface IncidentDetailModalProps {
  incident: Incident | null;
  open: boolean;
  onClose: () => void;
}

export function IncidentDetailModal({ incident, open, onClose }: IncidentDetailModalProps) {
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  // Local state to track the current incident state
  const [localIncident, setLocalIncident] = useState<Incident | null>(incident);
  const { toast } = useToast();
  const { updateIncident, updateTicket, getTicketById } = useTickets();

  // Update local state when incident prop changes
  useEffect(() => {
    setLocalIncident(incident);
  }, [incident]);

  if (!localIncident) return null;

  const handleSendEmail = () => {
    setShowEmailPreview(true);
    
    // Update incident to mark email as sent
    const now = new Date().toLocaleString();
    const updatedTimeline = [
      ...localIncident.timeline,
      {
        status: "Email Sent",
        timestamp: now,
        description: "Approval email sent to andrews@intelletica.com"
      }
    ];
    
    const updatedIncident = {
      ...localIncident,
      emailSent: true,
      timeline: updatedTimeline
    };
    
    setLocalIncident(updatedIncident);
    updateIncident(localIncident.id, {
      emailSent: true,
      timeline: updatedTimeline
    });

    // After 5 seconds, show approval notification and update status
    setTimeout(() => {
      toast({
        title: "Approval Received",
        description: "Approval for this ticket is received from andrews@intelletica.com",
      });

      const approvalTime = new Date().toLocaleString();
      const approvedTimeline = [
        ...updatedTimeline,
        {
          status: "Approved",
          timestamp: approvalTime,
          description: "Approval received from andrews@intelletica.com"
        }
      ];
      
      const finalIncident = {
        ...updatedIncident,
        approvalStatus: 'approved' as const,
        timeline: approvedTimeline
      };
      
      setLocalIncident(finalIncident);
      updateIncident(localIncident.id, {
        approvalStatus: 'approved',
        timeline: approvedTimeline
      });

      setShowEmailPreview(false);
    }, 5000);
  };

  const handleAttachLink = () => {
    if (!downloadLink.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid download link",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toLocaleString();
    const updatedTimeline = [
      ...localIncident.timeline,
      {
        status: "Link Attached",
        timestamp: now,
        description: `Download link attached: ${downloadLink}`
      }
    ];
    
    const updatedIncident = {
      ...localIncident,
      downloadLink: downloadLink,
      timeline: updatedTimeline
    };
    
    setLocalIncident(updatedIncident);
    updateIncident(localIncident.id, {
      downloadLink: downloadLink,
      timeline: updatedTimeline
    });

    toast({
      title: "Link Attached",
      description: "Download link has been attached to the incident",
    });

    setShowLinkInput(false);
    setDownloadLink('');
  };

  const handleSendLinkToUser = () => {
    if (!localIncident.downloadLink) {
      toast({
        title: "Error",
        description: "Please attach a download link first",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toLocaleString();
    const updatedTimeline = [
      ...localIncident.timeline,
      {
        status: "Link Sent",
        timestamp: now,
        description: `Download link sent to ${localIncident.createdBy}`
      }
    ];
    
    const updatedIncident = {
      ...localIncident,
      timeline: updatedTimeline
    };
    
    setLocalIncident(updatedIncident);
    updateIncident(localIncident.id, {
      timeline: updatedTimeline
    });

    toast({
      title: "Link Sent",
      description: `Download link has been sent to ${localIncident.createdBy}`,
    });
  };

  const handleCloseTicket = () => {
    const now = new Date().toLocaleString();
    const closedTimeline = [
      ...localIncident.timeline,
      {
        status: "Closed",
        timestamp: now,
        description: "Ticket closed by Support Engineer"
      }
    ];
    
    updateIncident(localIncident.id, {
      status: 'closed',
      updated: now,
      timeline: closedTimeline
    });

    // Close the linked SR ticket as well
    if (localIncident.relatedSR) {
      const linkedTicket = getTicketById(localIncident.relatedSR);
      if (linkedTicket) {
        updateTicket(localIncident.relatedSR, {
          status: 'closed',
          updated: now,
          comments: [
            ...(linkedTicket.comments || []),
            {
              author: 'Support Engineer',
              content: `Ticket closed. Linked incident ${localIncident.id} has been resolved.`,
              timestamp: now
            }
          ]
        });
      }
    }

    toast({
      title: "Ticket Closed",
      description: "The incident and linked SR have been closed successfully",
    });

    // Dispatch event for business user notification
    window.dispatchEvent(new CustomEvent('ticket-resolved', { 
      detail: { 
        incidentId: localIncident.id, 
        srId: localIncident.relatedSR,
        createdBy: localIncident.createdBy,
        title: localIncident.title
      } 
    }));

    onClose();
  };

  const emailContent = `
To: andrews@intelletica.com
Subject: Approval Required - ${localIncident.id}: ${localIncident.title}

Dear Manager,

An incident requires your approval:

Incident ID: ${localIncident.id}
Title: ${localIncident.title}
Priority: ${localIncident.priority}
Created by: ${localIncident.createdBy}
Created: ${localIncident.created}

Description:
${localIncident.description}

Please approve or reject this request.

Best regards,
Support Team
  `.trim();

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 flex flex-col gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <DialogTitle className="text-2xl">{localIncident.title}</DialogTitle>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="font-mono">{localIncident.id}</Badge>
              <Badge className={
                localIncident.status === "closed" || localIncident.status === "resolved"
                  ? "bg-success/10 text-success" 
                  : localIncident.status === "escalated"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }>
                {localIncident.status}
              </Badge>
              <Badge className={
                localIncident.priority === "critical" || localIncident.priority === "high" 
                  ? "bg-destructive text-destructive-foreground" 
                  : "bg-warning text-warning-foreground"
              }>
                {localIncident.priority} priority
              </Badge>
              <Badge variant="outline">{localIncident.category}</Badge>
              {localIncident.relatedSR && (
                <Badge variant="outline" className="text-primary">
                  Linked to: {localIncident.relatedSR}
                </Badge>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <div className="space-y-6 mt-4">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{localIncident.description}</p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-medium text-foreground">{localIncident.assignee}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Created By</p>
                    <p className="font-medium text-foreground">{localIncident.createdBy}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium text-foreground">{localIncident.created}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium text-foreground">{localIncident.updated}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Similar Incidents */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Similar Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="font-medium">INC298745 - Financial Report Access (Resolved)</p>
                      <p className="text-muted-foreground text-xs">Similar sensitive data access request</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">INC287632 - Quarterly Report Request (Resolved)</p>
                      <p className="text-muted-foreground text-xs">Manager approval required</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SOPs */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Standard Operating Procedures (SOPs)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-medium">SOP-001: Sensitive Data Access Protocol</p>
                      <p className="text-muted-foreground text-xs">1. Verify user authorization</p>
                      <p className="text-muted-foreground text-xs">2. Obtain manager approval</p>
                      <p className="text-muted-foreground text-xs">3. Provide secure download link</p>
                      <p className="text-muted-foreground text-xs">4. Log access in timeline</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* MELT Data */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    MELT Data (Metrics, Events, Logs, Traces)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Request Time:</span>
                      <span className="font-medium">{incident.created}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User Location:</span>
                      <span className="font-medium">Office Network (10.0.0.45)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Authentication:</span>
                      <span className="font-medium text-success">Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Access Level:</span>
                      <span className="font-medium">Manager Approval Required</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Fix from ServiceNow */}
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
                      <li>Send approval email to manager (andrews@intelletica.com)</li>
                      <li>Wait for manager approval confirmation</li>
                      <li>Generate secure download link with 24-hour expiration</li>
                      <li>Send link to requester via secure email</li>
                      <li>Close ticket and update audit log</li>
                    </ol>
                    <Badge className="mt-2 bg-success/10 text-success">Confidence: 95%</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Worklog */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Worklog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">Initial Assessment - Support Engineer</p>
                      <p className="text-muted-foreground text-xs">{localIncident.created}</p>
                      <p className="text-muted-foreground mt-1">Ticket received and assigned for processing. Verifying user authorization and preparing approval request.</p>
                    </div>
                    {localIncident.emailSent && (
                      <div className="text-sm">
                        <p className="font-medium">Manager Approval Requested</p>
                        <p className="text-muted-foreground text-xs">Email sent to andrews@intelletica.com</p>
                        <p className="text-muted-foreground mt-1">Approval email dispatched to manager for authorization.</p>
                      </div>
                    )}
                    {localIncident.approvalStatus === 'approved' && (
                      <div className="text-sm">
                        <p className="font-medium">Approval Received</p>
                        <p className="text-muted-foreground text-xs">Manager approved the request</p>
                        <p className="text-muted-foreground mt-1">Authorization granted. Proceeding with secure link generation.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Approval Status */}
              {localIncident.approvalStatus && (
                <Card className={
                  localIncident.approvalStatus === 'approved' 
                    ? "bg-success/5 border-success/20" 
                    : "bg-warning/5 border-warning/20"
                }>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approval Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={
                      localIncident.approvalStatus === 'approved'
                        ? "bg-success text-success-foreground"
                        : "bg-warning text-warning-foreground"
                    }>
                      {localIncident.approvalStatus.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* Download Link */}
              {localIncident.downloadLink && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Download Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={localIncident.downloadLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {localIncident.downloadLink}
                    </a>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              {localIncident.timeline && localIncident.timeline.length > 0 && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Incident Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {localIncident.timeline.map((entry, index) => (
                        <div key={index} className="flex gap-3 pb-3 border-b last:border-b-0">
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            {index < localIncident.timeline.length - 1 && (
                              <div className="w-0.5 h-full bg-border mt-1" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{entry.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {entry.status} • {entry.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Chat History */}
              {localIncident.chatHistory && localIncident.chatHistory.length > 0 && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Chat History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {localIncident.chatHistory.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Link Input Section */}
              {showLinkInput && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Attach Download Link</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="downloadLink">Download Link URL</Label>
                      <Input
                        id="downloadLink"
                        value={downloadLink}
                        onChange={(e) => setDownloadLink(e.target.value)}
                        placeholder="https://example.com/financial-report.pdf"
                        className="mt-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAttachLink}>
                        Attach Link
                      </Button>
                      <Button variant="outline" onClick={() => setShowLinkInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-3 px-6 py-4 border-t mt-0 bg-background flex-wrap">
            {!localIncident.emailSent && localIncident.status !== 'closed' && (
              <Button onClick={handleSendEmail} className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Email to Manager
              </Button>
            )}
            
            {localIncident.approvalStatus === 'approved' && !localIncident.downloadLink && !showLinkInput && (
              <Button onClick={() => setShowLinkInput(true)} variant="outline" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Attach Download Link
              </Button>
            )}

            {localIncident.downloadLink && localIncident.status !== 'closed' && (
              <Button onClick={handleSendLinkToUser} className="flex items-center gap-2">
                Send Link to User
              </Button>
            )}

            {localIncident.approvalStatus === 'approved' && localIncident.downloadLink && localIncident.status !== 'closed' && (
              <Button onClick={handleCloseTicket} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Close Ticket
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose}>
              Close View
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Preview Modal */}
      <Dialog open={showEmailPreview} onOpenChange={setShowEmailPreview}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Sent to Manager
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowEmailPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {emailContent}
              </pre>
            </div>
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                ⏳ Waiting for approval... (This will update automatically in 5 seconds)
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
