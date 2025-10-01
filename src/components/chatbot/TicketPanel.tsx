import { Ticket, CheckCircle2, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TicketDetailsModal } from "@/components/tickets/TicketDetailsModal";

interface TicketData {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee?: string;
  created?: string;
  updated?: string;
  category?: string;
  chatHistory?: any[];
  comments?: any[];
}

export function TicketPanel({ data }: { data: TicketData }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
    open: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    "in-progress": { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10" },
    "pending": { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    resolved: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  };

  const priorityColors: Record<string, string> = {
    low: "text-muted-foreground",
    medium: "text-warning",
    high: "text-destructive",
    critical: "text-destructive",
  };

  const status = data.status.toLowerCase();
  const priority = data.priority.toLowerCase();
  const StatusIcon = statusConfig[status]?.icon || Clock;

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mt-2 animate-fade-in shadow-md">
        <div className="flex items-start gap-3">
          <Ticket className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground">{data.title}</h4>
              <span className="text-xs font-mono text-muted-foreground">{data.id}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm mb-3">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig[status]?.bg || "bg-muted"}`}>
                <StatusIcon className={`h-3 w-3 ${statusConfig[status]?.color || "text-muted-foreground"}`} />
                <span className={statusConfig[status]?.color || "text-muted-foreground"}>
                  {status.replace("-", " ")}
                </span>
              </div>
              
              <span className={`${priorityColors[priority] || "text-muted-foreground"} capitalize`}>
                {priority} priority
              </span>
            </div>

            {data.assignee && (
              <p className="text-xs text-muted-foreground mb-3">
                Assigned to: {data.assignee}
              </p>
            )}

            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowDetails(true)}
              className="w-full"
            >
              <ExternalLink className="h-3 w-3 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>

      {showDetails && data.description && (
        <TicketDetailsModal
          ticket={{
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            assignee: data.assignee || "Unassigned",
            created: data.created || new Date().toLocaleString(),
            updated: data.updated || new Date().toLocaleString(),
            category: data.category || "General",
            chatHistory: data.chatHistory,
            comments: data.comments,
          }}
          open={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
