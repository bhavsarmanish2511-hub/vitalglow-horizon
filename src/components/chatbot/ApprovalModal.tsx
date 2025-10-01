import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApprovalModalProps {
  open: boolean;
  onClose: () => void;
  reportTitle: string;
}

export function ApprovalModal({ open, onClose, reportTitle }: ApprovalModalProps) {
  const [step, setStep] = useState<"approval" | "sharing">("approval");
  const { toast } = useToast();

  const handleApprove = () => {
    setStep("sharing");
  };

  const handleShare = () => {
    toast({
      title: "Report Shared",
      description: "Secure SharePoint link has been generated and shared.",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {step === "approval" ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-warning" />
                <DialogTitle>Approval Required</DialogTitle>
              </div>
              <DialogDescription>
                This report contains sensitive financial information and requires approval before sharing.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-muted p-4 rounded-lg my-4">
              <p className="font-medium text-foreground mb-2">{reportTitle}</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Contains Q4 revenue data</li>
                <li>• Includes cost analysis</li>
                <li>• Features forecasting models</li>
              </ul>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleApprove} className="bg-gradient-primary">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="h-5 w-5 text-success" />
                <DialogTitle>Report Approved</DialogTitle>
              </div>
              <DialogDescription>
                Generate a secure SharePoint link to share this report.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-success/10 p-4 rounded-lg my-4 border border-success/20">
              <p className="text-sm font-medium text-foreground mb-2">Secure Link Generated</p>
              <code className="text-xs text-muted-foreground break-all">
                https://fincompany.sharepoint.com/reports/Q4-2024-{Date.now()}
              </code>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleShare} className="bg-gradient-primary">
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
