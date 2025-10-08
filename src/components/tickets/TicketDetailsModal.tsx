import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Clock,
  User,
  Tag,
  MessageSquare,
  Download,
  ExternalLink,
  FileText,
  CheckCircle,
  AlertCircle,
  Paperclip,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TicketData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
  updated: string;
  category: string;
  resolution?: string; // Download link or resolution details
  chatHistory?: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
  }>;
  comments?: Array<{
    author: string;
    content: string;
    timestamp: string;
  }>;
  timeline?: Array<{
    status: string;
    description: string;
    timestamp: string;
    author?: string;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
  }>;
}

interface TicketDetailsModalProps {
  ticket: TicketData;
  open: boolean;
  onClose: () => void;
}

export function TicketDetailsModal({ ticket, open, onClose }: TicketDetailsModalProps) {
  const { toast } = useToast();
  const [showReportModal, setShowReportModal] = useState(false);

  const statusColor = ticket.status === "resolved"
    ? "bg-green-100 text-green-700"
    : "bg-blue-100 text-blue-700";
  const priorityColor =
    ticket.priority === "high" || ticket.priority === "critical"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  // Dummy HTML report for download
  const htmlReport = `
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>SR ${ticket.id} Report</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 2rem; }
        h1 { color: #2563eb; }
        .badge { display: inline-block; padding: 0.25em 0.75em; border-radius: 0.5em; font-size: 0.9em; margin-right: 0.5em; }
        .status { background: ${ticket.status === "resolved" ? "#dcfce7" : "#dbeafe"}; color: ${ticket.status === "resolved" ? "#166534" : "#1e40af"}; }
        .priority { background: ${ticket.priority === "high" || ticket.priority === "critical" ? "#fee2e2" : "#fef9c3"}; color: ${ticket.priority === "high" || ticket.priority === "critical" ? "#991b1b" : "#a16207"}; }
        .section { margin-bottom: 2em; }
        .card { background: #fff; border-radius: 1em; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 1.5em; margin-bottom: 1em; }
        .label { font-weight: bold; color: #64748b; }
        .chat, .comment { margin-bottom: 1em; padding: 1em; border-radius: 0.5em; background: #f1f5f9; }
        .chat.assistant { background: #e0e7ff; }
        .chat.user { background: #fef9c3; }
        .timestamp { color: #94a3b8; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <h1>Service Request Report</h1>
      <div class="section">
        <span class="badge status">${ticket.status.replace("-", " ")}</span>
        <span class="badge priority">${ticket.priority} priority</span>
        <span class="badge" style="background:#e0e7ff;color:#1e40af;">${ticket.category}</span>
      </div>
      <div class="section card">
        <div><span class="label">Ticket ID:</span> ${ticket.id}</div>
        <div><span class="label">Title:</span> ${ticket.title}</div>
        <div><span class="label">Assigned To:</span> ${ticket.assignee}</div>
        <div><span class="label">Created:</span> ${ticket.created}</div>
        <div><span class="label">Last Updated:</span> ${ticket.updated}</div>
      </div>
      <div class="section card">
        <div class="label">Description</div>
        <div>${ticket.description}</div>
      </div>
      <div class="section card">
        <div class="label">Timeline</div>
        ${ticket.timeline && ticket.timeline.length > 0
          ? ticket.timeline
              .map(
                (event) => `
                  <div>
                    <strong>${event.status}</strong> - ${event.description}
                    <div class="timestamp">${event.timestamp}${event.author ? " | By: " + event.author : ""}</div>
                  </div>
                `
              )
              .join("")
          : "<div>No timeline events.</div>"}
      </div>
      <div class="section card">
        <div class="label">Resolution</div>
        ${ticket.resolution
          ? `<a href="${ticket.resolution}" target="_blank">${ticket.resolution}</a>`
          : "<div>No resolution provided yet.</div>"}
      </div>
      <div class="section card">
        <div class="label">Attachments</div>
        ${ticket.attachments && ticket.attachments.length > 0
          ? ticket.attachments
              .map(
                (attachment) => `
                  <div>
                    <a href="${attachment.url}" target="_blank">${attachment.name}</a>
                  </div>
                `
              )
              .join("")
          : "<div>No attachments.</div>"}
      </div>
      <div class="section card">
        <div class="label">Chat History</div>
        ${ticket.chatHistory && ticket.chatHistory.length > 0
          ? ticket.chatHistory
              .map(
                (msg) => `
                  <div class="chat ${msg.role}">
                    <div><strong>${msg.role === "user" ? "James" : "AI Assistant"}</strong></div>
                    <div>${msg.content}</div>
                    ${msg.timestamp ? `<div class="timestamp">${msg.timestamp}</div>` : ""}
                  </div>
                `
              )
              .join("")
          : "<div>No chat history.</div>"}
      </div>
      <div class="section card">
        <div class="label">Comments</div>
        ${ticket.comments && ticket.comments.length > 0
          ? ticket.comments
              .map(
                (comment) => `
                  <div class="comment">
                    <div><strong>${comment.author}</strong> <span class="timestamp">${comment.timestamp}</span></div>
                    <div>${comment.content}</div>
                  </div>
                `
              )
              .join("")
          : "<div>No comments.</div>"}
      </div>
      <div class="section card">
        <div class="label">AI Actions & Recommendations</div>
        <ul>
          <li>Ticket created and categorized as <strong>${ticket.category}</strong>.</li>
          <li>Assigned to <strong>${ticket.assignee}</strong> for resolution.</li>
          <li>Priority set to <strong>${ticket.priority}</strong> based on initial assessment.</li>
          <li>AI assistant provided guidance and answered user queries in chat.</li>
          ${ticket.resolution ? "<li>Resolution provided with secure download link.</li>" : ""}
          ${ticket.status === "resolved" ? "<li>Ticket marked as resolved and closed.</li>" : ""}
        </ul>
      </div>
    </body>
  </html>
  `;

  // Download report as HTML file
  const handleDownloadReport = () => {
    const blob = new Blob([htmlReport], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SR_${ticket.id}_report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `SR ${ticket.id} detailed report has been downloaded.`,
    });
  };

  const handleViewReport = () => setShowReportModal(true);
  const handleCloseReportModal = () => setShowReportModal(false);

  const handleOpenSharePoint = () => {
    window.open(`https://fincompany.sharepoint.com/tickets/${ticket.id}`, '_blank');
    toast({
      title: "Opening SharePoint",
      description: "Secure document link opened in new tab.",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] flex flex-col" style={{ padding: 0 }}>
          {/* Header */}
          <div className="p-6 pb-0">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <Ticket className="h-6 w-6 text-primary" />
                <DialogTitle className="text-2xl">{ticket.title}</DialogTitle>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="font-mono">{ticket.id}</Badge>
                <Badge className={statusColor}>
                  {ticket.status.replace("-", " ")}
                </Badge>
                <Badge className={priorityColor}>
                  {ticket.priority} priority
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-700">{ticket.category}</Badge>
              </div>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-auto pr-4 px-6 py-4">
            <div className="space-y-6 mt-4">
              <Card className="shadow-lg border-2 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">Ticket Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">Assigned To</p>
                        <p className="font-medium text-foreground">{ticket.assignee}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium text-foreground">{ticket.category}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium text-foreground">{ticket.created}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium text-foreground">{ticket.updated}</p>
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
                  <p className="text-muted-foreground">{ticket.description}</p>
                </CardContent>
              </Card>

              {/* Timeline */}
              {ticket.timeline && ticket.timeline.length > 0 && (
                <Card className="bg-muted/50 border border-blue-100 shadow">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                      <Clock className="h-4 w-4" />
                      Ticket Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ticket.timeline.map((event, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
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
                          </div>
                          <div className="flex-1 pb-2">
                            <p className="font-medium text-sm text-blue-700">{event.status}</p>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{event.timestamp}</p>
                            {event.author && (
                              <p className="text-xs text-muted-foreground">By: {event.author}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Resolution Field */}
              {ticket.resolution && (
                <Card className="bg-success/5 border-success/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-success">
                      <Download className="h-4 w-4" />
                      Resolution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Download Link:</p>
                      <a 
                        href={ticket.resolution} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all text-sm font-medium flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {ticket.resolution}
                      </a>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      This link provides access to the resolved document or resource.
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <Card className="bg-muted/50 border border-indigo-100 shadow">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-indigo-700">
                      <Paperclip className="h-4 w-4" />
                      Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {ticket.attachments.map((attachment, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="w-full justify-between border-indigo-200"
                          onClick={() => window.open(attachment.url, "_blank")}
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

              {/* Chat History */}
              {ticket.chatHistory && ticket.chatHistory.length > 0 && (
                <Card className="bg-muted/50 border border-indigo-100 shadow">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-indigo-700">
                      <MessageSquare className="h-4 w-4" />
                      Associated Chat History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ticket.chatHistory.map((msg, index) => (
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

              {/* Comments */}
              {ticket.comments && ticket.comments.length > 0 && (
                <Card className="bg-muted/50 border border-green-100 shadow">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                      <MessageSquare className="h-4 w-4" />
                      Activity & Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ticket.comments.map((comment, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-green-700">{comment.author}</p>
                            <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t mt-4 px-6 pb-6">
            <Button variant="outline" onClick={handleDownloadReport} className="flex items-center gap-2 border-blue-200">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={handleViewReport} className="flex items-center gap-2 border-indigo-200">
              <FileText className="h-4 w-4" />
              View Detailed Report
            </Button>
            <Button variant="outline" onClick={handleOpenSharePoint} className="flex items-center gap-2 border-green-200">
              <ExternalLink className="h-4 w-4" />
              SharePoint Link
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Detailed Report Modal */}
      <Dialog open={showReportModal} onOpenChange={handleCloseReportModal}>
        <DialogContent className="max-w-2xl bg-gray-50 shadow-xl border-2 border-blue-100 flex flex-col" style={{ padding: 0 }}>
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle>
                <span className="flex items-center gap-2 text-blue-700">
                  <FileText className="h-5 w-5" />
                  SR {ticket.id} - Detailed Ticket Report
                </span>
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="flex-1 min-h-0 overflow-auto px-6 py-4 max-h-[70vh]">
            <div className="space-y-6">
              {/* Ticket Metadata */}
              <div>
                <div className="flex gap-2 mb-2">
                  <Badge className={statusColor}>{ticket.status.replace("-", " ")}</Badge>
                  <Badge className={priorityColor}>{ticket.priority} priority</Badge>
                  <Badge className="bg-indigo-100 text-indigo-700">{ticket.category}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <span className="font-semibold text-muted-foreground">Ticket ID:</span> {ticket.id}
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Assigned To:</span> {ticket.assignee}
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Created:</span> {ticket.created}
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Last Updated:</span> {ticket.updated}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold">Status Meaning:</span> {ticket.status === "resolved" ? "Ticket has been fully resolved and closed." : "Ticket is currently open and under review."}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold">Priority Meaning:</span> {ticket.priority === "critical" ? "Immediate attention required." : ticket.priority === "high" ? "High urgency, should be prioritized." : "Standard or low priority."}
                </div>
              </div>
              <Separator />

              {/* Timeline */}
              {ticket.timeline && ticket.timeline.length > 0 && (
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Ticket Timeline</h3>
                  <div className="space-y-3">
                    {ticket.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
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
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="font-medium text-sm text-blue-700">{event.status}</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{event.timestamp}</p>
                          {event.author && (
                            <p className="text-xs text-muted-foreground">By: {event.author}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Description</h3>
                <p className="text-muted-foreground">{ticket.description}</p>
              </div>
              <Separator />

              {/* Resolution */}
              {ticket.resolution && (
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">Resolution</h3>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-success" />
                    <span className="text-sm text-muted-foreground">Download Link:</span>
                    <a
                      href={ticket.resolution}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all text-sm font-medium flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {ticket.resolution}
                    </a>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    This link provides access to the resolved document or resource.
                  </div>
                </div>
              )}
              <Separator />

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-indigo-700 mb-2">Attachments</h3>
                  <div className="space-y-2">
                    {ticket.attachments.map((attachment, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-between border-indigo-200"
                        onClick={() => window.open(attachment.url, "_blank")}
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
              <Separator />

              {/* Chat History */}
              <div>
                <h3 className="font-semibold text-indigo-700 mb-2">Chat History</h3>
                {ticket.chatHistory && ticket.chatHistory.length > 0 ? (
                  ticket.chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg shadow-sm border mb-2 ${
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
                  ))
                ) : (
                  <p className="text-muted-foreground">No chat history.</p>
                )}
              </div>
              <Separator />

              {/* Comments */}
              <div>
                <h3 className="font-semibold text-green-700 mb-2">Activity & Comments</h3>
                {ticket.comments && ticket.comments.length > 0 ? (
                  ticket.comments.map((comment, index) => (
                    <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-green-700">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No comments.</p>
                )}
              </div>
              <Separator />

              {/* AI Actions / Recommendations */}
              <div>
                <h3 className="font-semibold text-primary mb-2">AI Actions & Recommendations</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Ticket created and categorized as <strong>{ticket.category}</strong>.</li>
                  <li>Assigned to <strong>{ticket.assignee}</strong> for resolution.</li>
                  <li>Priority set to <strong>{ticket.priority}</strong> based on initial assessment.</li>
                  <li>AI assistant provided guidance and answered user queries in chat.</li>
                  {ticket.resolution && (
                    <li>Resolution provided with secure download link.</li>
                  )}
                  {ticket.status === "resolved" && (
                    <li>Ticket marked as resolved and closed.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2 px-6 pb-6">
            <Button variant="outline" onClick={handleCloseReportModal}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}