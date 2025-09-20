import React, { useState } from 'react';
import { Brain, Heart, Sparkles } from 'lucide-react';
import { MoodEntry } from '@/types/patient';
import { cn } from '@/lib/utils';

interface MentalHealthCheckProps {
  moodHistory: MoodEntry[];
  onMoodSelect: (mood: MoodEntry['mood']) => void;
}

export const MentalHealthCheck: React.FC<MentalHealthCheckProps> = ({ 
  moodHistory, 
  onMoodSelect 
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const moods = [
    { emoji: '😊', mood: 'excellent' as const, label: 'Excellent' },
    { emoji: '🙂', mood: 'good' as const, label: 'Good' },
    { emoji: '😐', mood: 'neutral' as const, label: 'Neutral' },
    { emoji: '😔', mood: 'low' as const, label: 'Low' },
    { emoji: '😟', mood: 'poor' as const, label: 'Poor' },
  ];

  const handleMoodSelect = (mood: MoodEntry['mood']) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
    
    // Animate feedback
    setTimeout(() => setSelectedMood(null), 1500);
  };

  const getMoodColor = (mood: MoodEntry['mood']) => {
    switch (mood) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-primary';
      case 'neutral':
        return 'text-accent';
      case 'low':
        return 'text-warning';
      case 'poor':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getLatestMood = () => {
    if (moodHistory.length === 0) return null;
    return moodHistory[0];
  };

  const latestMood = getLatestMood();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Mental Health</h2>
        <Brain className="w-5 h-5 text-secondary" />
      </div>

      {/* Mood Selector */}
      <div className="glass-card p-4">
        <p className="text-sm text-muted-foreground mb-3">How are you feeling today?</p>
        
        <div className="flex justify-between gap-2">
          {moods.map((moodOption) => (
            <button
              key={moodOption.mood}
              onClick={() => handleMoodSelect(moodOption.mood)}
              className={cn(
                "flex-1 p-3 rounded-xl transition-all duration-300",
                "hover:scale-110 hover:shadow-lg hover:shadow-primary/30",
                selectedMood === moodOption.mood 
                  ? "bg-primary/30 scale-110" 
                  : "glass-button"
              )}
            >
              <div className="text-3xl mb-1">{moodOption.emoji}</div>
              <p className="text-xs text-muted-foreground">{moodOption.label}</p>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="mt-4 p-3 rounded-lg bg-primary/10 fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <p className="text-sm font-medium">Mood Logged!</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Thank you for sharing. Your care team has been notified.
            </p>
          </div>
        )}
      </div>

      {/* AI Reminders */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-destructive" />
          <p className="text-sm font-medium">AI Wellness Reminders</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 animate-pulse" />
            <p className="text-sm">Time for your breathing exercise - 5 minutes</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary mt-1.5" />
            <p className="text-sm">Consider a short walk in 30 minutes</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
            <p className="text-sm">Mindfulness session available at 3 PM</p>
          </div>
        </div>
      </div>

      {/* Mood History */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="glass-button w-full text-center"
      >
        {showHistory ? 'Hide' : 'View'} Mood History
      </button>

      {showHistory && moodHistory.length > 0 && (
        <div className="glass-card p-4 space-y-3 fade-in">
          <h3 className="text-sm font-medium mb-2">Recent Mood Entries</h3>
          
          {moodHistory.slice(0, 5).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {moods.find(m => m.mood === entry.mood)?.emoji}
                </span>
                <div>
                  <p className={cn("text-sm font-medium", getMoodColor(entry.mood))}>
                    {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {entry.aiInsights && (
                <p className="text-xs text-muted-foreground max-w-[150px] text-right">
                  {entry.aiInsights}
                </p>
              )}
            </div>
          ))}

          {/* Mood Trend */}
          <div className="glass-card p-3 mt-4">
            <p className="text-xs text-muted-foreground mb-2">7-Day Emotional Trend</p>
            <div className="h-12 flex items-end gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-primary/50 to-primary/10 rounded-t"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-primary mt-2">
              Cognitive health score: 82% - Stable
            </p>
          </div>
        </div>
      )}
    </div>
  );
};