import React, { useState } from 'react';
import { Camera as CameraIcon, Shield, AlertTriangle, Activity, User } from 'lucide-react';
import { Camera } from '@/types/patient';
import { cn } from '@/lib/utils';

interface VideoMonitoringProps {
  cameras: Camera[];
}

export const VideoMonitoring: React.FC<VideoMonitoringProps> = ({ cameras }) => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showCameraGrid, setShowCameraGrid] = useState(false);

  const getStatusColor = (status: Camera['status']) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'privacy':
        return 'text-secondary';
      case 'inactive':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getActivityIcon = (activity: string) => {
    if (activity.includes('Fall')) return <AlertTriangle className="w-4 h-4 text-destructive" />;
    if (activity.includes('walking')) return <Activity className="w-4 h-4 text-primary" />;
    if (activity.includes('distress')) return <AlertTriangle className="w-4 h-4 text-warning" />;
    return <User className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Video Monitoring</h2>
        <Shield className="w-5 h-5 text-secondary" />
      </div>

      {/* Monitoring Status */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-sm">AI-Assisted Monitoring Active</span>
          </div>
          <span className="text-xs text-muted-foreground">Privacy-First</span>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          Event-triggered monitoring only. Cameras activate on detected distress or environmental risks.
        </p>

        {/* Recent Detections */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary">Recent Detections</p>
          {cameras.slice(0, 2).map((camera) => (
            <div key={camera.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getActivityIcon(camera.lastActivity)}
                <span className="text-xs">{camera.lastActivity}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(camera.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowCameraGrid(true)}
          className="mt-4 w-full glass-button text-sm"
        >
          View Camera Grid
        </button>
      </div>

      {/* Camera Grid Modal */}
      {showCameraGrid && (
        <div 
          className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowCameraGrid(false);
            setSelectedCamera(null);
          }}
        >
          <div 
            className="glass-card p-6 max-w-md w-full max-h-[80vh] overflow-y-auto slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Camera Feeds</h3>
              <button
                onClick={() => {
                  setShowCameraGrid(false);
                  setSelectedCamera(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Camera Grid */}
            <div className="grid grid-cols-2 gap-3">
              {cameras.map((camera) => (
                <div
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  className={cn(
                    "glass-card p-3 cursor-pointer transition-all duration-300",
                    "hover:scale-105 hover:shadow-lg hover:shadow-primary/30",
                    selectedCamera?.id === camera.id && "ring-2 ring-primary"
                  )}
                >
                  <div className="aspect-video bg-gradient-to-br from-card-glass to-card rounded-lg mb-2 flex items-center justify-center">
                    <CameraIcon className={cn("w-8 h-8", getStatusColor(camera.status))} />
                  </div>
                  
                  <p className="text-xs font-medium mb-1">{camera.location}</p>
                  
                  <div className="flex items-center gap-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      camera.status === 'active' ? "bg-success animate-pulse" :
                      camera.status === 'privacy' ? "bg-secondary" : "bg-muted"
                    )} />
                    <span className="text-xs text-muted-foreground capitalize">
                      {camera.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-1">
                    {getActivityIcon(camera.lastActivity)}
                    <span className="text-xs text-muted-foreground truncate">
                      {camera.lastActivity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Camera Detail */}
            {selectedCamera && (
              <div className="mt-4 glass-card p-4 fade-in">
                <h4 className="text-sm font-medium mb-2">{selectedCamera.location}</h4>
                
                <div className="aspect-video bg-gradient-to-br from-card-glass to-card rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-center">
                    <CameraIcon className="w-12 h-12 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground">Live Feed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={getStatusColor(selectedCamera.status)}>
                      {selectedCamera.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last Activity:</span>
                    <span>{selectedCamera.lastActivity}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Time:</span>
                    <span>
                      {new Date(selectedCamera.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Activity Log */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs font-medium mb-2">Activity Log (Real-time)</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">12:34 PM</span>
                      <span>Patient walking normally</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">12:30 PM</span>
                      <span>No activity detected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};