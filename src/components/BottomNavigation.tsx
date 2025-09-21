import React from 'react';
import { Home, Activity, Pill, Brain, Video, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const navItems = [
    { id: 'home', icon: Home, label: '🏠', tooltip: 'Home' },
    { id: 'vitals', icon: Activity, label: '❤️', tooltip: 'Vitals' },
    { id: 'meds', icon: Pill, label: '💊', tooltip: 'Meds' },
    { id: 'mental', icon: Brain, label: '🙂', tooltip: 'Mental' },
    { id: 'video', icon: Video, label: '📹', tooltip: 'Monitor' },
    { id: 'telehealth', icon: Calendar, label: '📅', tooltip: 'Health' },
    { id: 'alerts', icon: Activity, label: '🔔', tooltip: 'Alerts' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-primary/20">
      <div className="pb-6 pt-2">
        <div className="flex justify-around px-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "relative flex-1 py-2 px-1 rounded-2xl transition-all duration-500",
                  "flex flex-col items-center gap-0.5 group",
                  isActive 
                    ? "scale-110" 
                    : "hover:scale-105 active:scale-95"
                )}
              >
                {/* Glow effect for active item */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/30 via-primary/20 to-transparent blur-md animate-pulse" />
                )}
                
                {/* Icon with emoji */}
                <div className={cn(
                  "relative text-lg transition-all duration-300",
                  isActive && "animate-bounce-subtle"
                )}>
                  {item.label}
                </div>
                
                {/* Text label */}
                <span className={cn(
                  "text-[9px] font-medium transition-all duration-300",
                  isActive 
                    ? "text-primary drop-shadow-glow" 
                    : "text-muted-foreground opacity-60"
                )}>
                  {item.tooltip}
                </span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary shadow-glow animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};