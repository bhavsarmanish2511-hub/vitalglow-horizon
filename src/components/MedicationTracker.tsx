import React, { useState } from 'react';
import { Pill, Clock, Battery, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Medication } from '@/types/patient';
import { cn } from '@/lib/utils';

interface MedicationTrackerProps {
  medications: Medication[];
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({ medications }) => {
  const [expandedMed, setExpandedMed] = useState<string | null>(null);

  const getNextDoseTime = (nextDose: Date) => {
    const now = new Date();
    const diff = nextDose.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    if (minutes > 0) return `in ${minutes}m`;
    return 'Now';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold mb-3">Today's Medications</h2>
      
      {medications.map((med) => (
        <div
          key={med.id}
          className={cn(
            "glass-card p-4 cursor-pointer transition-all duration-300",
            expandedMed === med.id && "scale-105"
          )}
          onClick={() => setExpandedMed(expandedMed === med.id ? null : med.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                med.taken 
                  ? "bg-success/20 text-success" 
                  : "bg-warning/20 text-warning animate-pulse"
              )}>
                <Pill className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold">{med.name}</h3>
                <p className="text-sm text-muted-foreground">{med.dosage}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  {med.taken ? (
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Taken</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-warning">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">Pending</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{getNextDoseTime(med.nextDose)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              med.taken 
                ? "bg-success/10" 
                : "bg-warning/10"
            )}>
              {med.taken ? (
                <CheckCircle className="w-6 h-6 text-success" />
              ) : (
                <XCircle className="w-6 h-6 text-warning" />
              )}
            </div>
          </div>

          {/* Pill Bottle Status */}
          {med.pillBottle && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    med.pillBottle.isOnline ? "bg-success animate-pulse" : "bg-muted"
                  )} />
                  <span className="text-muted-foreground">Smart Bottle</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Battery className={cn(
                      "w-3 h-3",
                      med.pillBottle.battery > 20 ? "text-success" : "text-warning"
                    )} />
                    <span className="text-muted-foreground">{med.pillBottle.battery}%</span>
                  </div>
                  <span className="text-muted-foreground">
                    Synced {new Date(med.pillBottle.lastSync).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Expanded Details */}
          {expandedMed === med.id && (
            <div className="mt-4 pt-4 border-t border-border/50 space-y-3 fade-in">
              <div className="glass-card p-3">
                <p className="text-xs text-muted-foreground mb-2">Schedule</p>
                <div className="flex gap-2 flex-wrap">
                  {med.schedule.map((time, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-3">
                <p className="text-xs text-muted-foreground mb-2">Adherence (Last 7 days)</p>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 h-8 rounded",
                        i < 5 ? "bg-success/30" : "bg-warning/30"
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-success mt-2">71% adherence rate</p>
              </div>

              <div className="glass-card p-3">
                <p className="text-xs text-muted-foreground mb-2">AI Tips</p>
                <p className="text-xs">
                  Take with food to reduce stomach upset. Avoid grapefruit juice.
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};