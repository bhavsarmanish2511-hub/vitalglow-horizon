import React, { useState } from 'react';
import { Video, Calendar, Phone, Clock, Check } from 'lucide-react';
import { Appointment } from '@/types/patient';
import { cn } from '@/lib/utils';

interface TelehealthSupportProps {
  appointments: Appointment[];
  onScheduleAppointment: (date: Date, time: string) => void;
}

export const TelehealthSupport: React.FC<TelehealthSupportProps> = ({ 
  appointments, 
  onScheduleAppointment 
}) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const nextAppointment = appointments.find(apt => apt.status === 'scheduled');
  const totalAppointments = appointments.length;

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      onScheduleAppointment(selectedDate, selectedTime);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowScheduler(false);
        setShowConfirmation(false);
      }, 2000);
    }
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Telehealth & Support</h2>
        <Video className="w-5 h-5 text-primary" />
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Next Appointment</p>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold">{nextAppointment.doctorName}</p>
              <p className="text-sm text-muted-foreground">{nextAppointment.specialty}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {new Date(nextAppointment.dateTime).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(nextAppointment.dateTime).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
          
          <button className="w-full glass-button text-sm group">
            <span className="group-hover:scale-110 inline-block transition-transform">
              Join Session
            </span>
          </button>
        </div>
      )}

      {/* Schedule Appointment */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            <span className="text-sm">Total Appointments: {totalAppointments}</span>
          </div>
          <Phone className="w-4 h-4 text-destructive" />
        </div>

        <button
          onClick={() => setShowScheduler(true)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
        >
          Schedule Appointment
        </button>

        <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse mr-2" />
          Emergency contact available 24/7
        </div>
      </div>

      {/* Scheduler Modal */}
      {showScheduler && (
        <div 
          className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => !showConfirmation && setShowScheduler(false)}
        >
          <div 
            className="glass-card p-6 max-w-sm w-full slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {!showConfirmation ? (
              <>
                <h3 className="text-xl font-bold mb-4">Schedule Appointment</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Select Date</p>
                    <input
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="w-full p-3 rounded-lg bg-input border border-border/50 text-foreground"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Select Time</p>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "p-2 rounded-lg text-xs transition-all",
                            selectedTime === time
                              ? "bg-primary text-primary-foreground"
                              : "glass-button"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowScheduler(false)}
                      className="flex-1 glass-button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSchedule}
                      disabled={!selectedTime}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium disabled:opacity-50"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 fade-in">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-2">Appointment Scheduled!</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDate.toLocaleDateString()} at {selectedTime}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};