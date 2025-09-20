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
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'vitals', icon: Activity, label: 'Vitals' },
    { id: 'meds', icon: Pill, label: 'Meds' },
    { id: 'mental', icon: Brain, label: 'Mental' },
    { id: 'video', icon: Video, label: 'Monitor' },
    { id: 'telehealth', icon: Calendar, label: 'Health' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50">
      <div className="pb-6 pt-2">
        <div className="flex justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex-1 py-2 px-1 rounded-xl transition-all duration-300",
                  "flex flex-col items-center gap-1",
                  isActive 
                    ? "bg-primary/20 scale-105" 
                    : "hover:bg-white/5"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "text-primary drop-shadow-glow" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-[10px] transition-all duration-300",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};