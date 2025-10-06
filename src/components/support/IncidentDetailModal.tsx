import { useState } from 'react';
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
  X
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
  const { toast } = useToast();
  const { updateIncident } = useTickets();

  if (!incident) return null;

  const handleSendEmail = () => {
    setShowEmailPreview(true);
    
    // Update incident to mark email as sent
    const now = new Date().toLocaleString();
    updateIncident(incident.id, {
      emailSent: true,
      timeline: [
        ...incident.timeline,
        {
          status: "Email Sent",
          timestamp: now,
          description: "Approval email sent to andrews@intelletica.com"
        }
      ]
    });

    // After 5 seconds, show approval notification
    setTimeout(() => {
      toast({
        title: "Approval Received",
        description: "Approval for this ticket is received from andrews@intelletica.com",
      });

      const approvalTime = new Date().toLocaleString();
      updateIncident(incident.id, {
        approvalStatus: 'approved',
        timeline: [
          ...incident.timeline,
          {
            status: "Email Sent",
            timestamp: now,
            description: "Approval email sent to andrews@intelletica.com"
          },
          {
            status: "Approved",
            timestamp: approvalTime,
            description: "Approval received from andrews@intelletica.com"
          }
        ]
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
    updateIncident(incident.id, {
      downloadLink: downloadLink,
      timeline: [
        ...incident.timeline,
        {
          status: "Link Attached",
          timestamp: now,
          description: `Download link attached: ${downloadLink}`
        }
      ]
    });

    toast({
      title: "Link Attached",
      description: "Download link has been attached to the incident",
    });

    setShowLinkInput(false);
    setDownloadLink('');
  };

  const handleSendLinkToUser = () => {
    if (!incident.downloadLink) {
      toast({
        title: "Error",
        description: "Please attach a download link first",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toLocaleString();
    updateIncident(incident.id, {
      timeline: [
        ...incident.timeline,
        {
          status: "Link Sent",
          timestamp: now,
          description: `Download link sent to ${incident.createdBy}`
        }
      ]
    });

    toast({
      title: "Link Sent",
      description: `Download link has been sent to ${incident.createdBy}`,
    });
  };

  const handleCloseTicket = () => {
    const now = new Date().toLocaleString();
    updateIncident(incident.id, {
      status: 'closed',
      updated: now,
      timeline: [
        ...incident.timeline,
        {
          status: "Closed",
          timestamp: now,
          description: "Ticket closed by Support Engineer"
        }
      ]
    });

    toast({
      title: "Ticket Closed",
      description: "The incident has been closed successfully",
    });

    onClose();
  };

  const emailContent = `
To: andrews@intelletica.com
Subject: Approval Required - ${incident.id}: ${incident.title}

Dear Manager,

An incident requires your approval:

Incident ID: ${incident.id}
Title: ${incident.title}
Priority: ${incident.priority}
Created by: ${incident.createdBy}
Created: ${incident.created}

Description:
${incident.description}

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
              <DialogTitle className="text-2xl">{incident.title}</DialogTitle>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="font-mono">{incident.id}</Badge>
              <Badge className={
                incident.status === "closed" || incident.status === "resolved"
                  ? "bg-success/10 text-success" 
                  : incident.status === "escalated"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }>
                {incident.status}
              </Badge>
              <Badge className={
                incident.priority === "critical" || incident.priority === "high" 
                  ? "bg-destructive text-destructive-foreground" 
                  : "bg-warning text-warning-foreground"
              }>
                {incident.priority} priority
              </Badge>
              <Badge variant="outline">{incident.category}</Badge>
              {incident.relatedSR && (
                <Badge variant="outline" className="text-primary">
                  Linked to: {incident.relatedSR}
                </Badge>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <div className="space-y-6 mt-4">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{incident.description}</p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-medium text-foreground">{incident.assignee}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Created By</p>
                    <p className="font-medium text-foreground">{incident.createdBy}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium text-foreground">{incident.created}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium text-foreground">{incident.updated}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Approval Status */}
              {incident.approvalStatus && (
                <Card className={
                  incident.approvalStatus === 'approved' 
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
                      incident.approvalStatus === 'approved'
                        ? "bg-success text-success-foreground"
                        : "bg-warning text-warning-foreground"
                    }>
                      {incident.approvalStatus.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* Download Link */}
              {incident.downloadLink && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Download Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={incident.downloadLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {incident.downloadLink}
                    </a>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              {incident.timeline && incident.timeline.length > 0 && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Incident Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {incident.timeline.map((entry, index) => (
                        <div key={index} className="flex gap-3 pb-3 border-b last:border-b-0">
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            {index < incident.timeline.length - 1 && (
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
              {incident.chatHistory && incident.chatHistory.length > 0 && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Chat History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {incident.chatHistory.map((msg, index) => (
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
            {!incident.emailSent && incident.status !== 'closed' && (
              <Button onClick={handleSendEmail} className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Email to Manager
              </Button>
            )}
            
            {incident.approvalStatus === 'approved' && !incident.downloadLink && !showLinkInput && (
              <Button onClick={() => setShowLinkInput(true)} variant="outline" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Attach Download Link
              </Button>
            )}

            {incident.downloadLink && incident.status !== 'closed' && (
              <Button onClick={handleSendLinkToUser} className="flex items-center gap-2">
                Send Link to User
              </Button>
            )}

            {incident.approvalStatus === 'approved' && incident.downloadLink && incident.status !== 'closed' && (
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
