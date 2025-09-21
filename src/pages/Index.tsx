import React, { useState } from 'react';
import { PatientSummaryCard } from '@/components/PatientSummaryCard';
import { VitalsOverview } from '@/components/VitalsOverview';
import { MedicationTracker } from '@/components/MedicationTracker';
import { MentalHealthCheck } from '@/components/MentalHealthCheck';
import { VideoMonitoring } from '@/components/VideoMonitoring';
import { TelehealthSupport } from '@/components/TelehealthSupport';
import { AlertsActions } from '@/components/AlertsActions';
import { BottomNavigation } from '@/components/BottomNavigation';
import { IPhoneMockup } from '@/components/IPhoneMockup';
import { Patient, Vital, Medication, MoodEntry, Camera, Appointment, Alert } from '@/types/patient';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  // Mock data
  const patient: Patient = {
    id: '1',
    name: 'Alex Chen',
    age: 67,
    healthScore: 87,
    riskLevel: 'Low',
    lastSync: new Date(Date.now() - 2 * 60 * 1000),
    bio: 'Retired engineer, enjoys gardening and reading. Lives independently with smart home assistance.',
    chronicConditions: ['Hypertension', 'Type 2 Diabetes', 'Arthritis'],
    recentEvents: [
      {
        id: '1',
        type: 'fall',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        severity: 'low',
        description: 'Minor stumble detected in hallway, no injury'
      }
    ],
    devices: [
      {
        id: '1',
        name: 'SmartWatch Pro',
        type: 'wearable',
        battery: 85,
        lastSync: new Date(Date.now() - 2 * 60 * 1000),
        isOnline: true
      },
      {
        id: '2',
        name: 'MediBottle AI',
        type: 'pill_bottle',
        battery: 92,
        lastSync: new Date(Date.now() - 10 * 60 * 1000),
        isOnline: true
      }
    ]
  };

  const vitals: Vital[] = [
    { type: 'heart_rate', value: 72, unit: 'bpm', timestamp: new Date(), trend: 'stable' },
    { type: 'blood_pressure', value: 120, unit: '/80', timestamp: new Date(), trend: 'stable' },
    { type: 'oxygen', value: 98, unit: '%', timestamp: new Date(), trend: 'stable' },
    { type: 'glucose', value: 95, unit: 'mg/dL', timestamp: new Date(), trend: 'decreasing' }
  ];

  const medications: Medication[] = [
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      schedule: ['8:00 AM', '8:00 PM'],
      taken: true,
      nextDose: new Date(Date.now() + 6 * 60 * 60 * 1000),
      pillBottle: patient.devices[1]
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      schedule: ['9:00 AM', '6:00 PM'],
      taken: false,
      nextDose: new Date(Date.now() + 30 * 60 * 1000),
      pillBottle: patient.devices[1]
    }
  ];

  const [moodHistory] = useState<MoodEntry[]>([
    {
      id: '1',
      emoji: '🙂',
      mood: 'good',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      aiInsights: 'Positive trend observed'
    }
  ]);

  const cameras: Camera[] = [
    {
      id: '1',
      location: 'Living Room',
      status: 'active',
      lastActivity: 'Patient walking',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '2',
      location: 'Bedroom',
      status: 'privacy',
      lastActivity: 'No activity',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '3',
      location: 'Kitchen',
      status: 'active',
      lastActivity: 'Normal activity',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: '4',
      location: 'Hallway',
      status: 'inactive',
      lastActivity: 'No activity',
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ];

  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      type: 'telehealth',
      status: 'scheduled'
    }
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'medication',
      message: 'Medication reminder: Metformin due',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      aiAction: 'Notification sent to patient device',
      severity: 'warning'
    },
    {
      id: '2',
      type: 'vital',
      message: 'Blood pressure slightly elevated',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      aiAction: 'Monitoring increased, doctor notified if trend continues',
      severity: 'info'
    }
  ];

  const handleMoodSelect = (mood: MoodEntry['mood']) => {
    console.log('Mood selected:', mood);
  };

  const handleScheduleAppointment = (date: Date, time: string) => {
    console.log('Appointment scheduled:', date, time);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <PatientSummaryCard patient={patient} />;
      case 'vitals':
        return <VitalsOverview vitals={vitals} />;
      case 'meds':
        return <MedicationTracker medications={medications} />;
      case 'mental':
        return (
          <MentalHealthCheck 
            moodHistory={moodHistory} 
            onMoodSelect={handleMoodSelect} 
          />
        );
      case 'video':
        return <VideoMonitoring cameras={cameras} />;
      case 'telehealth':
        return (
          <TelehealthSupport 
            appointments={appointments} 
            onScheduleAppointment={handleScheduleAppointment} 
          />
        );
      case 'alerts':
        return <AlertsActions alerts={alerts} />;
      default:
        return <PatientSummaryCard patient={patient} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
      
      {/* App Title Outside Phone */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          VitalGlow Horizon
        </h1>
        <p className="text-gray-400 mt-1">AI-Powered Patient Dashboard 2035</p>
      </div>
      
      {/* iPhone Mockup with App */}
      <div className="relative z-20">
        <IPhoneMockup>
          <div className="flex flex-col h-full bg-gradient-to-br from-background via-card to-background relative">
            {/* App Header with Title Inside Phone */}
            <div className="glass-card rounded-b-2xl px-4 pt-12 pb-3 flex-shrink-0">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-primary glow-text">VitalGlow</h2>
                <p className="text-[10px] text-muted-foreground">Patient Monitoring System</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-2xl font-bold">
                    {new Date().toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                </div>
              </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-20">
              <div className="py-3 space-y-3">
                {renderContent()}
              </div>
            </div>

            {/* Fixed Bottom Navigation */}
            <BottomNavigation 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
          </div>
        </IPhoneMockup>
      </div>
      
      {/* Device Info */}
      <div className="absolute bottom-8 right-8 text-right z-10">
        <p className="text-gray-300 text-sm font-medium">iPhone 15 Pro</p>
        <p className="text-gray-500 text-xs">iOS 19.0 • Healthcare Edition</p>
        <p className="text-gray-600 text-xs mt-1">9:16 Display</p>
      </div>
    </div>
  );
};

export default Index;