import { AlertCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IncidentDetailsModal } from "@/components/incidents/IncidentDetailsModal";

interface IncidentData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
  updated: string;
  category: string;
  chatHistory?: any[];
  timeline: Array<{
    status: string;
    timestamp: string;
    description: string;
  }>;
  relatedSR?: string;
}

export function IncidentTimeline({ data }: { data: IncidentData }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const severityColors: Record<string, string> = {
    low: "text-muted-foreground",
    medium: "text-warning",
    high: "text-destructive",
    critical: "text-destructive",
  };

  const priority = data.priority?.toLowerCase() || "medium";

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mt-2 animate-fade-in shadow-md">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className={`h-5 w-5 ${severityColors[priority]} mt-0.5`} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-foreground">{data.title}</h4>
              <span className="text-xs font-mono text-muted-foreground">{data.id}</span>
            </div>
            <span className={`text-xs capitalize ${severityColors[priority]}`}>
              {priority} priority
            </span>
          </div>
        </div>

        <div className="space-y-3 ml-8 border-l-2 border-border pl-4">
          {data.timeline.map((event, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
              <div className="flex items-start gap-2">
                <Clock className="h-3 w-3 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{event.description || event.status}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setShowDetails(true)}
          className="w-full mt-3"
        >
          <ExternalLink className="h-3 w-3 mr-2" />
          View Details
        </Button>
      </div>

      {showDetails && (
        <IncidentDetailsModal
          incident={data}
          open={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
