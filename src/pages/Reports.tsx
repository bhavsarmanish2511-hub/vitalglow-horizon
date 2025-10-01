import { useState } from "react";
import { FileText, Download, Eye, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportDetailsModal } from "@/components/reports/ReportDetailsModal";

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: "approved" | "pending" | "draft";
  description: string;
  content: string;
  sharepointLink?: string;
  requiresApproval: boolean;
}

const mockReports: Report[] = [
  {
    id: "RPT001",
    title: "Q4 2024 Revenue Analysis",
    type: "Financial",
    date: "2024-12-15",
    status: "approved",
    description: "Comprehensive Q4 revenue breakdown with forecasting",
    content: "Finance Report Q4 2024: Revenue $2.3M, Expenses $1.1M, P&L Summary shows 52% profit margin, Payroll Overview: 45 employees, total compensation $850K",
    sharepointLink: "https://fincompany.sharepoint.com/reports/Q4-2024-revenue",
    requiresApproval: true,
  },
  {
    id: "RPT002",
    title: "Q2 2024 Expense Summary",
    type: "Financial",
    date: "2024-06-30",
    status: "approved",
    description: "Detailed expense breakdown for Q2 operations",
    content: "Finance Report Q2 2024: Total Revenue $1.8M, Total Expenses $980K, P&L Summary shows 45% margin, Payroll Overview: 42 employees",
    sharepointLink: "https://fincompany.sharepoint.com/reports/Q2-2024-expenses",
    requiresApproval: true,
  },
  {
    id: "RPT003",
    title: "Monthly Operations Report",
    type: "Operations",
    date: "2024-12-01",
    status: "pending",
    description: "Operational metrics and KPIs for December",
    content: "Operations Report December 2024: 98% uptime, 145 support tickets resolved, average response time 2.3 hours",
    requiresApproval: false,
  },
];

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "draft":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-2">View and manage your financial and operational reports</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockReports.map((report) => (
            <Card
              key={report.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{report.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {report.id}
                      </Badge>
                      {report.requiresApproval && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">Type: {report.type}</span>
                      <span className="text-muted-foreground">Date: {report.date}</span>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status === "approved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {report.status === "approved" && (
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          open={!!selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
};

export default Reports;
