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
    <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
      <div className="glass-card p-2 rounded-2xl shadow-2xl">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex-1 p-3 rounded-xl transition-all duration-300",
                  "flex flex-col items-center gap-1",
                  isActive 
                    ? "bg-primary/20 scale-110" 
                    : "hover:bg-white/5"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs transition-all duration-300",
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};