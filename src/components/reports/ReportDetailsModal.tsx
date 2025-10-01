import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  description: string;
  content: string;
  sharepointLink?: string;
  requiresApproval: boolean;
}

interface ReportDetailsModalProps {
  report: Report;
  open: boolean;
  onClose: () => void;
}

export function ReportDetailsModal({ report, open, onClose }: ReportDetailsModalProps) {
  const handleSharePointOpen = () => {
    if (report.sharepointLink) {
      window.open(report.sharepointLink, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl">{report.title}</DialogTitle>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{report.id}</Badge>
            <Badge variant="outline">{report.type}</Badge>
            <Badge className={report.status === "approved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
              {report.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground">{report.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">Report Details</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-foreground whitespace-pre-wrap">{report.content}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Generated Date</p>
              <p className="font-medium text-foreground">{report.date}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Report Type</p>
              <p className="font-medium text-foreground">{report.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Approval Status</p>
              <p className="font-medium text-foreground">
                {report.requiresApproval ? "Required" : "Not Required"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium text-foreground capitalize">{report.status}</p>
            </div>
          </div>

          {report.sharepointLink && report.status === "approved" && (
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                SharePoint Document Link
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Access the full report via secure SharePoint link
              </p>
              <Button variant="outline" onClick={handleSharePointOpen} className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in SharePoint
              </Button>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            {report.status === "approved" && (
              <>
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Report
                </Button>
              </>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
