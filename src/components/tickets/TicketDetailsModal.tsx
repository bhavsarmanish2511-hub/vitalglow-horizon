import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, User, Tag, MessageSquare, Download, ExternalLink, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
}

interface TicketDetailsModalProps {
  ticket: TicketData;
  open: boolean;
  onClose: () => void;
}

export function TicketDetailsModal({ ticket, open, onClose }: TicketDetailsModalProps) {
  const { toast } = useToast();

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: `SR ${ticket.id} detailed report has been downloaded.`,
    });
  };

  const handleViewReport = () => {
    toast({
      title: "Opening Detailed Report",
      description: "Viewing all AI actions taken to resolve this ticket.",
    });
  };

  const handleOpenSharePoint = () => {
    window.open(`https://fincompany.sharepoint.com/tickets/${ticket.id}`, '_blank');
    toast({
      title: "Opening SharePoint",
      description: "Secure document link opened in new tab.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Ticket className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl">{ticket.title}</DialogTitle>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="font-mono">{ticket.id}</Badge>
            <Badge className={ticket.status === "resolved" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}>
              {ticket.status.replace("-", " ")}
            </Badge>
            <Badge className={ticket.priority === "high" || ticket.priority === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}>
              {ticket.priority} priority
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{ticket.description}</p>
            </div>

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

            <Separator className="my-4" />

            {/* Chat History */}
            {ticket.chatHistory && ticket.chatHistory.length > 0 && (
              <>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Associated Chat History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ticket.chatHistory.map((msg, index) => (
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

            {/* Comments */}
            {ticket.comments && ticket.comments.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Activity & Comments
                </h3>
                <div className="space-y-4">
                  {ticket.comments.map((comment, index) => (
                    <div key={index} className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={handleDownloadReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button variant="outline" onClick={handleViewReport} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            View Detailed Report
          </Button>
          <Button variant="outline" onClick={handleOpenSharePoint} className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            SharePoint Link
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
