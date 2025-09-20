export interface Patient {
  id: string;
  name: string;
  age: number;
  healthScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  lastSync: Date;
  devices: Device[];
  bio?: string;
  chronicConditions?: string[];
  recentEvents?: HealthEvent[];
}

export interface Device {
  id: string;
  name: string;
  type: 'wearable' | 'pill_bottle' | 'sensor';
  battery: number;
  lastSync: Date;
  isOnline: boolean;
}

export interface HealthEvent {
  id: string;
  type: 'fall' | 'alert' | 'medication_missed' | 'vitals_abnormal';
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface Vital {
  type: 'heart_rate' | 'blood_pressure' | 'oxygen' | 'glucose';
  value: number;
  unit: string;
  timestamp: Date;
  trend: 'stable' | 'increasing' | 'decreasing';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string[];
  taken: boolean;
  nextDose: Date;
  pillBottle?: Device;
}

export interface MoodEntry {
  id: string;
  emoji: string;
  mood: 'excellent' | 'good' | 'neutral' | 'low' | 'poor';
  timestamp: Date;
  aiInsights?: string;
}

export interface Camera {
  id: string;
  location: string;
  status: 'active' | 'inactive' | 'privacy';
  lastActivity: string;
  timestamp: Date;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  dateTime: Date;
  type: 'telehealth' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Alert {
  id: string;
  type: 'vital' | 'medication' | 'fall' | 'emergency';
  message: string;
  timestamp: Date;
  aiAction?: string;
  severity: 'info' | 'warning' | 'critical';
}