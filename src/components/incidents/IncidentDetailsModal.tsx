import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Clock,
  User,
  Paperclip,
  ExternalLink,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  // Helper for status color
  const statusColor =
    incident.status === "resolved"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";
  const sevPriColor =
    incident.severity === "critical" ||
    incident.severity === "high" ||
    incident.priority === "critical" ||
    incident.priority === "high"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-3xl w-full max-h-[90vh] flex flex-col bg-gray-50 shadow-xl border-2 border-blue-100"
        style={{ padding: 0 }}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <DialogTitle className="text-2xl text-blue-700">{incident.title}</DialogTitle>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="font-mono">{incident.id}</Badge>
              {(incident.severity || incident.priority) && (
                <Badge className={sevPriColor}>
                  {incident.severity || incident.priority} {incident.severity ? "severity" : "priority"}
                </Badge>
              )}
              <Badge className={statusColor}>
                {incident.status.replace("-", " ")}
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-700">{incident.category}</Badge>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-auto px-6 py-4">
          <div className="space-y-6">
            <Card className="shadow-lg border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-700">Incident Details</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card className="shadow border border-yellow-100">
              <CardHeader>
                <CardTitle className="text-md text-yellow-700">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{incident.description}</p>
              </CardContent>
            </Card>

            {/* Chat History */}
            {incident.chatHistory && incident.chatHistory.length > 0 && (
              <Card className="bg-muted/50 border border-indigo-100 shadow">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-indigo-700">
                    <MessageSquare className="h-4 w-4" />
                    Associated Chat History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {incident.chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg shadow-sm border ${
                        msg.role === "user"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-indigo-50 border-indigo-200"
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 capitalize text-indigo-700">
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
            )}

            {/* Timeline */}
            {incident.timeline && incident.timeline.length > 0 && (
              <Card className="bg-muted/50 border border-blue-100 shadow">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                    <Clock className="h-4 w-4" />
                    Incident Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {incident.timeline.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-blue-200">
                            {event.status === "Resolved" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : event.status === "Created" ? (
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          {index < incident.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-sm text-blue-700">{event.status || event.event}</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{event.timestamp || event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attachments */}
            {incident.attachments && incident.attachments.length > 0 && (
              <Card className="bg-muted/50 border border-green-100 shadow">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                    <Paperclip className="h-4 w-4" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {incident.attachments.map((attachment, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-between border-green-200"
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        
        {/* <div className="flex gap-3 pt-4 border-t mt-4 px-6 pb-6">
          <Button variant="outline" className="flex-1 border-blue-200">
            Add Update
          </Button>
          {incident.status === "resolved" && (
            <Button className="flex-1 border-green-200 bg-green-100 text-green-700">
              Close Incident
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div> */}
        <div className="flex justify-end pt-4 border-t mt-4 px-6 pb-6">
          {incident.status === "resolved" && (
            <Button 
              className="border-green-200 bg-green-100 text-green-700 mr-2"
              onClick={onClose}
            >
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