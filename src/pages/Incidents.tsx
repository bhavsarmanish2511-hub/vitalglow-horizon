import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IncidentDetailsModal } from "@/components/incidents/IncidentDetailsModal";
import { useTickets } from "@/contexts/TicketsContext";
import type { Incident as IncidentType } from "@/contexts/TicketsContext";

const Incidents = () => {
  const { incidents } = useTickets();
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-destructive/70 text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-success/10 text-success";
      case "in-progress":
      case "approved":
        return "bg-primary/10 text-primary";
      case "created":
      case "routed":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incidents</h1>
          <p className="text-muted-foreground mt-2">Monitor and resolve critical incidents</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {incidents.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Incidents</h3>
              <p className="text-muted-foreground">Open the AI Assistant chat to report incidents</p>
            </Card>
          ) : (
            incidents.map((incident) => (
            <Card
              key={incident.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedIncident(incident)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{incident.title}</h3>
                      <Badge variant="outline" className="text-xs font-mono">
                        {incident.id}
                      </Badge>
                      <Badge className={getPriorityColor(incident.priority)}>
                        {incident.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status.replace("-", " ")}
                      </Badge>
                      <span className="text-muted-foreground">Assigned: {incident.assignee}</span>
                      <span className="text-muted-foreground">{incident.category}</span>
                      <span className="text-muted-foreground">Updated: {incident.updated}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </Card>
            ))
          )}
        </div>
      </div>

      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          open={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </>
  );
};

export default Incidents;
