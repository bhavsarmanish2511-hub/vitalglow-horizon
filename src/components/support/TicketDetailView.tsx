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
import { 
  Clock, 
  User, 
  AlertCircle, 
  FileText, 
  Activity,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { Ticket } from "@/data/mockTickets";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TicketDetailViewProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
}

export function TicketDetailView({ ticket, open, onClose }: TicketDetailViewProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 flex flex-col gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <DialogTitle className="text-2xl">{ticket.title}</DialogTitle>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="font-mono">{ticket.id}</Badge>
            <Badge className={
              ticket.status === "resolved" 
                ? "bg-success/10 text-success" 
                : ticket.status === "escalated"
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            }>
              {ticket.status.replace("-", " ")}
            </Badge>
            <Badge className={
              ticket.priority === "critical" || ticket.priority === "high" 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-warning text-warning-foreground"
            }>
              {ticket.priority} priority
            </Badge>
            <Badge variant="outline">{ticket.category}</Badge>
            {ticket.slaTimer && (
              <Badge variant="outline" className="text-warning">
                <Clock className="h-3 w-3 mr-1" />
                {ticket.slaTimer}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="space-y-6 mt-4">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{ticket.description}</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-medium text-foreground">{ticket.assignee}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Created By</p>
                  <p className="font-medium text-foreground">{ticket.createdBy}</p>
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

            <Separator />

            {/* Similar Incidents */}
            {ticket.similarIncidents && ticket.similarIncidents.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Similar Incidents ({ticket.similarIncidents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ticket.similarIncidents.map((incident) => (
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
            {ticket.sops && ticket.sops.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Standard Operating Procedures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ticket.sops.map((sop, index) => (
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
            {ticket.meltData && (
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
                        <Progress value={ticket.meltData.cpuUsage} className="flex-1" />
                        <span className="text-sm font-medium">{ticket.meltData.cpuUsage}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Memory Usage</p>
                      <div className="flex items-center gap-2">
                        <Progress value={ticket.meltData.memoryUsage} className="flex-1" />
                        <span className="text-sm font-medium">{ticket.meltData.memoryUsage}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Error Rate</p>
                      <div className="flex items-center gap-2">
                        <Progress value={ticket.meltData.errorRate * 100} className="flex-1" />
                        <span className="text-sm font-medium">{ticket.meltData.errorRate}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Fix */}
            {ticket.recommendedFix && (
              <Card className="bg-success/5 border-success/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    Recommended Fix from ServiceNow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{ticket.recommendedFix}</p>
                  <Button 
                    onClick={handleExecuteWorkflow}
                    disabled={isExecuting}
                    className="w-full"
                  >
                    {isExecuting ? "Updating Worklog..." : "Update Worklog"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Worklog */}
            {ticket.worklog && ticket.worklog.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Work Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ticket.worklog.map((entry, index) => (
                      <div key={index} className="flex gap-3 pb-3 border-b last:border-b-0">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          {index < ticket.worklog!.length - 1 && (
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
          <Button variant="outline" className="flex-1">
            Add Update
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
