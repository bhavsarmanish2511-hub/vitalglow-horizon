import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Ticket as TicketIcon } from "lucide-react";

interface PriorityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface TicketBreakdownData {
  incidents: {
    total: number;
    priorities: PriorityBreakdown;
  };
  serviceRequests: {
    total: number;
    priorities: PriorityBreakdown;
  };
}

interface TicketBreakdownModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: TicketBreakdownData;
}

export function TicketBreakdownModal({ open, onClose, title, data }: TicketBreakdownModalProps) {
  const priorityColors = {
    critical: "bg-destructive text-destructive-foreground",
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-warning text-warning-foreground",
    low: "bg-muted",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Incidents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-warning" />
                Incidents
                <Badge variant="secondary" className="ml-auto">{data.incidents.total}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Critical (P1)</span>
                  <Badge className={priorityColors.critical}>
                    {data.incidents.priorities.critical}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">High (P2)</span>
                  <Badge className={priorityColors.high}>
                    {data.incidents.priorities.high}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Medium (P3)</span>
                  <Badge className={priorityColors.medium}>
                    {data.incidents.priorities.medium}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Low (P4)</span>
                  <Badge className={priorityColors.low}>
                    {data.incidents.priorities.low}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Requests Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TicketIcon className="h-5 w-5 text-blue-500" />
                Service Requests
                <Badge variant="secondary" className="ml-auto">{data.serviceRequests.total}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Critical (P1)</span>
                  <Badge className={priorityColors.critical}>
                    {data.serviceRequests.priorities.critical}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">High (P2)</span>
                  <Badge className={priorityColors.high}>
                    {data.serviceRequests.priorities.high}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Medium (P3)</span>
                  <Badge className={priorityColors.medium}>
                    {data.serviceRequests.priorities.medium}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Low (P4)</span>
                  <Badge className={priorityColors.low}>
                    {data.serviceRequests.priorities.low}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
