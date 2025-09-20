import React, { useState } from 'react';
import { Heart, Activity, Droplets, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Vital } from '@/types/patient';
import { cn } from '@/lib/utils';

interface VitalsOverviewProps {
  vitals: Vital[];
}

export const VitalsOverview: React.FC<VitalsOverviewProps> = ({ vitals }) => {
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [selectedVital, setSelectedVital] = useState<Vital | null>(null);

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'heart_rate':
        return <Heart className="w-5 h-5" />;
      case 'blood_pressure':
        return <Activity className="w-5 h-5" />;
      case 'oxygen':
        return <Droplets className="w-5 h-5" />;
      case 'glucose':
        return <Activity className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getVitalColor = (type: string) => {
    switch (type) {
      case 'heart_rate':
        return 'text-destructive';
      case 'blood_pressure':
        return 'text-primary';
      case 'oxygen':
        return 'text-secondary';
      case 'glucose':
        return 'text-warning';
      default:
        return 'text-accent';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-warning" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-success" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getVitalName = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-4">
      {/* View Mode Selector */}
      <div className="flex justify-center gap-2">
        {(['Day', 'Week', 'Month'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
              viewMode === mode
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "glass-button"
            )}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-4">
        {vitals.map((vital, index) => (
          <div
            key={index}
            onClick={() => setSelectedVital(vital)}
            className="glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2 rounded-lg bg-white/5", getVitalColor(vital.type))}>
                {getVitalIcon(vital.type)}
              </div>
              {getTrendIcon(vital.trend)}
            </div>

            <p className="text-xs text-muted-foreground mb-1">
              {getVitalName(vital.type)}
            </p>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{vital.value}</span>
              <span className="text-xs text-muted-foreground">{vital.unit}</span>
            </div>

            {/* Mini Chart Visualization */}
            <div className="mt-3 h-12 relative">
              <svg className="w-full h-full">
                <defs>
                  <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" className={cn("opacity-50", getVitalColor(vital.type))} />
                    <stop offset="100%" className="opacity-0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 24 Q 20 18, 40 20 T 80 16 T 120 22 T 160 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className={getVitalColor(vital.type)}
                />
                <path
                  d="M 0 24 Q 20 18, 40 20 T 80 16 T 120 22 T 160 18 L 160 48 L 0 48 Z"
                  fill={`url(#gradient-${index})`}
                  opacity="0.3"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedVital && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVital(null)}
        >
          <div 
            className="glass-card p-6 max-w-sm w-full slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {getVitalName(selectedVital.type)}
              </h3>
              <button
                onClick={() => setSelectedVital(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-2">Current Reading</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{selectedVital.value}</span>
                  <span className="text-sm text-muted-foreground">{selectedVital.unit}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getTrendIcon(selectedVital.trend)}
                  <span className="text-sm capitalize">{selectedVital.trend}</span>
                </div>
              </div>

              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-2">AI Insights</p>
                <p className="text-sm">
                  Your {getVitalName(selectedVital.type).toLowerCase()} is within normal range. 
                  Continue monitoring for optimal health maintenance.
                </p>
              </div>

              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-2">Predicted Range (Next 24h)</p>
                <div className="flex justify-between text-sm">
                  <span>Min: {Math.floor(selectedVital.value * 0.9)} {selectedVital.unit}</span>
                  <span>Max: {Math.floor(selectedVital.value * 1.1)} {selectedVital.unit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};