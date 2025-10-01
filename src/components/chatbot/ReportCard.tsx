import { FileText, Download, Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ApprovalModal } from "./ApprovalModal";
import { TicketDetailsModal } from "@/components/tickets/TicketDetailsModal";

interface ReportData {
  id?: string;
  title: string;
  description?: string;
  summary: string;
  status: string;
  priority?: string;
  assignee?: string;
  created?: string;
  updated?: string;
  category?: string;
  chatHistory?: any[];
  comments?: any[];
  requiresApproval?: boolean;
  sharepointLink?: string;
}

export function ReportCard({ data }: { data: ReportData }) {
  const [showApproval, setShowApproval] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = data.sharepointLink || '#';
    link.download = `${data.title.replace(/\s+/g, '-')}.pdf`;
    link.click();
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mt-2 animate-fade-in shadow-md">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">{data.title}</h4>
          </div>
          {data.requiresApproval && (
            <Lock className="h-4 w-4 text-warning" />
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{data.summary}</p>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                data.status === "completed" && "bg-success/10 text-success",
                data.status === "approved" && "bg-success/10 text-success",
                data.status === "pending" && "bg-warning/10 text-warning",
                data.status === "generating" && "bg-muted text-muted-foreground"
              )}
            >
              {(data.status === "completed" || data.status === "approved") && "Completed"}
              {data.status === "pending" && "Awaiting Approval"}
              {data.status === "generating" && "Generating..."}
            </span>
            
            {(data.status === "completed" || data.status === "approved") && (
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            {data.requiresApproval && data.status === "pending" && (
              <Button size="sm" onClick={() => setShowApproval(true)}>
                Review
              </Button>
            )}
          </div>

          {data.id && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowDetails(true)}
              className="w-full"
            >
              <ExternalLink className="h-3 w-3 mr-2" />
              View Details
            </Button>
          )}
        </div>
      </div>

      {showApproval && (
        <ApprovalModal
          open={showApproval}
          onClose={() => setShowApproval(false)}
          reportTitle={data.title}
        />
      )}

      {showDetails && data.id && data.description && (
        <TicketDetailsModal
          ticket={{
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority || "medium",
            assignee: data.assignee || "Unassigned",
            created: data.created || new Date().toLocaleString(),
            updated: data.updated || new Date().toLocaleString(),
            category: data.category || "Reports",
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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
