import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, Wifi, Battery, User } from 'lucide-react';
import { Patient } from '@/types/patient';
import { cn } from '@/lib/utils';

interface PatientSummaryCardProps {
  patient: Patient;
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({ patient }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-success glow-text';
      case 'Medium':
        return 'text-warning glow-text';
      case 'High':
        return 'text-destructive glow-text';
      default:
        return 'text-muted-foreground';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getTimeDifference = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div 
      className={cn(
        "glass-card p-6 transition-all duration-500 cursor-pointer",
        isExpanded && "pb-8"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <User className="w-8 h-8 text-background" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-success-glow animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-wide">{patient.name}</h2>
            <p className="text-muted-foreground">Age {patient.age}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-primary" />
        ) : (
          <ChevronDown className="w-6 h-6 text-primary" />
        )}
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Health Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-3xl font-bold", getHealthScoreColor(patient.healthScore))}>
              {patient.healthScore}
            </span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <p className={cn("text-sm mt-1", getHealthScoreColor(patient.healthScore))}>
            {patient.healthScore >= 80 ? 'Excellent' : patient.healthScore >= 60 ? 'Good' : 'Needs Attention'}
          </p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Risk Level</span>
          </div>
          <p className={cn("text-2xl font-bold", getRiskLevelColor(patient.riskLevel))}>
            {patient.riskLevel}
          </p>
          <p className="text-sm text-muted-foreground mt-1">AI Assessment</p>
        </div>
      </div>

      {/* Device Status */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">Last sync:</span>
          <span className="text-primary">{getTimeDifference(patient.lastSync)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Battery className="w-4 h-4 text-warning" />
          <span className="text-muted-foreground">Devices:</span>
          <span className="text-success">Online</span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 space-y-4 fade-in">
          {/* Bio */}
          {patient.bio && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-primary mb-2">Patient Bio</h3>
              <p className="text-sm text-muted-foreground">{patient.bio}</p>
            </div>
          )}

          {/* Chronic Conditions */}
          {patient.chronicConditions && patient.chronicConditions.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-primary mb-2">Chronic Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {patient.chronicConditions.map((condition, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Connected Devices */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-primary mb-3">Connected Devices</h3>
            <div className="space-y-2">
              {patient.devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      device.isOnline ? "bg-success animate-pulse" : "bg-muted"
                    )} />
                    <span className="text-sm">{device.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Battery className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{device.battery}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {getTimeDifference(device.lastSync)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          {patient.recentEvents && patient.recentEvents.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-primary mb-3">Recent Events</h3>
              <div className="space-y-2">
                {patient.recentEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-start gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5",
                      event.severity === 'high' ? 'bg-destructive' :
                      event.severity === 'medium' ? 'bg-warning' : 'bg-primary'
                    )} />
                    <div className="flex-1">
                      <p className="text-sm">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeDifference(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};