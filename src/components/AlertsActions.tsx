import React from 'react';
import { AlertTriangle, Bot, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Alert } from '@/types/patient';
import { cn } from '@/lib/utils';

interface AlertsActionsProps {
  alerts: Alert[];
}

export const AlertsActions: React.FC<AlertsActionsProps> = ({ alerts }) => {
  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-destructive bg-destructive/20';
      case 'warning':
        return 'text-warning bg-warning/20';
      default:
        return 'text-primary bg-primary/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Alerts & AI Actions</h2>
        <Bot className="w-5 h-5 text-secondary" />
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="glass-card p-4">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                getSeverityColor(alert.severity)
              )}>
                {getSeverityIcon(alert.severity)}
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">{alert.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
                
                {alert.aiAction && (
                  <div className="mt-2 p-2 rounded-lg bg-primary/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">AI Response</span>
                    </div>
                    <p className="text-xs">{alert.aiAction}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};