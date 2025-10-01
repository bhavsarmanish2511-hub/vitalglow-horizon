import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, User, Paperclip, ExternalLink, MessageSquare, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface IncidentData {
  id: string;
  title: string;
  description: string;
  severity?: string;
  priority?: string;
  status: string;
  assignedTo?: string;
  assignee?: string;
  approver?: string;
  created: string;
  updated: string;
  category: string;
  chatHistory?: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
  }>;
  timeline?: Array<{
    time?: string;
    timestamp?: string;
    event?: string;
    status?: string;
    description?: string;
    author?: string;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
  }>;
}

interface IncidentDetailsModalProps {
  incident: IncidentData;
  open: boolean;
  onClose: () => void;
}

export function IncidentDetailsModal({ incident, open, onClose }: IncidentDetailsModalProps) {
  const handleAttachmentOpen = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <DialogTitle className="text-2xl">{incident.title}</DialogTitle>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="font-mono">{incident.id}</Badge>
            {(incident.severity || incident.priority) && (
              <Badge className={(incident.severity === "critical" || incident.severity === "high" || incident.priority === "critical" || incident.priority === "high") ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"}>
                {incident.severity || incident.priority} {incident.severity ? "severity" : "priority"}
              </Badge>
            )}
            <Badge className={incident.status === "resolved" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}>
              {incident.status.replace("-", " ")}
            </Badge>
            <Badge variant="outline">{incident.category}</Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{incident.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-medium text-foreground">{incident.assignedTo || incident.assignee}</p>
                </div>
              </div>
              {incident.approver && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Approver</p>
                    <p className="font-medium text-foreground">{incident.approver}</p>
                  </div>
                </div>
              )}
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

            <Separator className="my-4" />

            {/* Chat History */}
            {incident.chatHistory && incident.chatHistory.length > 0 && (
              <>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Associated Chat History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {incident.chatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          msg.role === "user"
                            ? "bg-primary/10 ml-4"
                            : "bg-card mr-4"
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1 capitalize">
                          {msg.role === "user" ? "James" : "AI Assistant"}
                        </p>
                        <p className="text-sm">{msg.content}</p>
                        {msg.timestamp && (
                          <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Separator className="my-4" />
              </>
            )}

            {/* Timeline */}
            {incident.timeline && incident.timeline.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Incident Timeline
                </h3>
                <div className="space-y-3">
                  {incident.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {event.status === "Resolved" ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : event.status === "Created" ? (
                            <AlertCircle className="h-4 w-4 text-primary" />
                          ) : (
                            <Clock className="h-4 w-4 text-warning" />
                          )}
                        </div>
                        {index < incident.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-sm">{event.status || event.event}</p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{event.timestamp || event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {incident.attachments && incident.attachments.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </h3>
                <div className="space-y-2">
                  {incident.attachments.map((attachment, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => handleAttachmentOpen(attachment.url)}
                    >
                      <span className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        {attachment.name}
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t mt-4">
          <Button variant="outline" className="flex-1">
            Add Update
          </Button>
          {incident.status === "resolved" && (
            <Button className="flex-1">
              Close Incident
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
