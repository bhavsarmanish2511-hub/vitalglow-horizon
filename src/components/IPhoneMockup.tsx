import React from 'react';

interface IPhoneMockupProps {
  children: React.ReactNode;
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({ children }) => {
  return (
    <div className="relative mx-auto" style={{ width: '375px', height: '812px' }}>
      {/* iPhone Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 rounded-[60px] shadow-2xl">
        {/* Top Bezel */}
        <div className="absolute top-0 left-0 right-0 h-12 rounded-t-[60px] bg-black" />
        
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full z-20" />
        
        {/* Side Buttons */}
        {/* Power Button */}
        <div className="absolute -right-1 top-44 w-1 h-20 bg-gray-700 rounded-l" />
        
        {/* Volume Up */}
        <div className="absolute -left-1 top-32 w-1 h-12 bg-gray-700 rounded-r" />
        
        {/* Volume Down */}
        <div className="absolute -left-1 top-48 w-1 h-12 bg-gray-700 rounded-r" />
        
        {/* Mute Switch */}
        <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-700 rounded-r" />
        
        {/* Screen Container */}
        <div className="absolute top-3 left-3 right-3 bottom-3 bg-black rounded-[50px] overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-11 bg-transparent z-30 flex items-center justify-between px-8 pt-3">
            <div className="flex items-center gap-1">
              <span className="text-white text-xs font-medium">9:41</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Signal */}
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="1" y="4" width="3" height="8" rx="1" fill="white" />
                <rect x="6" y="2.5" width="3" height="9.5" rx="1" fill="white" />
                <rect x="12" y="0" width="3" height="12" rx="1" fill="white" />
              </svg>
              
              {/* WiFi */}
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none" className="ml-1">
                <path d="M7.5 2.5C9.5 2.5 11.5 3.5 13 5L7.5 10.5L2 5C3.5 3.5 5.5 2.5 7.5 2.5Z" stroke="white" strokeWidth="1.5" fill="white" />
              </svg>
              
              {/* Battery */}
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none" className="ml-1">
                <rect x="1" y="2" width="21" height="8" rx="2" stroke="white" strokeWidth="1" />
                <rect x="23" y="5" width="1" height="2" rx="0.5" fill="white" />
                <rect x="2" y="3" width="18" height="6" rx="1" fill="#34C759" />
              </svg>
            </div>
          </div>
          
          {/* App Content */}
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
        </div>
        
        {/* Screen Reflection Effect */}
        <div className="absolute inset-3 rounded-[50px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Phone Shadow */}
      <div className="absolute inset-0 rounded-[60px] shadow-2xl" 
           style={{ 
             boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(0, 0, 0, 0.6)' 
           }} 
      />
    </div>
  );
};