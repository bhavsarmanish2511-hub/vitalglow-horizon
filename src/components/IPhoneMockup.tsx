import React from 'react';

interface IPhoneMockupProps {
  children: React.ReactNode;
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({ children }) => {
  // 9:16 aspect ratio: width 360px, height 640px for the screen
  // Adding frame makes total: 390px x 844px
  return (
    <div className="relative mx-auto" style={{ width: '390px', height: '844px' }}>
      {/* iPhone Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 rounded-[50px] shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30" />
        
        {/* Side Buttons */}
        {/* Power Button */}
        <div className="absolute -right-1 top-44 w-1 h-16 bg-gray-700 rounded-l" />
        
        {/* Volume Up */}
        <div className="absolute -left-1 top-32 w-1 h-10 bg-gray-700 rounded-r" />
        
        {/* Volume Down */}
        <div className="absolute -left-1 top-44 w-1 h-10 bg-gray-700 rounded-r" />
        
        {/* Mute Switch */}
        <div className="absolute -left-1 top-24 w-1 h-6 bg-gray-700 rounded-r" />
        
        {/* Screen Container - 9:16 aspect ratio */}
        <div className="absolute top-3 left-3 right-3 bottom-3 bg-black rounded-[40px] overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-30 flex items-center justify-between px-6 pt-2">
            <div className="flex items-center gap-1">
              <span className="text-white text-xs font-semibold">9:41</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Signal */}
              <svg width="15" height="10" viewBox="0 0 17 12" fill="none">
                <rect x="1" y="4" width="3" height="8" rx="1" fill="white" opacity="0.9" />
                <rect x="6" y="2.5" width="3" height="9.5" rx="1" fill="white" opacity="0.9" />
                <rect x="12" y="0" width="3" height="12" rx="1" fill="white" opacity="0.9" />
              </svg>
              
              {/* WiFi */}
              <svg width="13" height="9" viewBox="0 0 15 11" fill="none" className="ml-1">
                <path d="M7.5 2.5C9.5 2.5 11.5 3.5 13 5L7.5 10.5L2 5C3.5 3.5 5.5 2.5 7.5 2.5Z" stroke="white" strokeWidth="1.5" fill="white" opacity="0.9" />
              </svg>
              
              {/* Battery */}
              <svg width="22" height="10" viewBox="0 0 25 12" fill="none" className="ml-1">
                <rect x="1" y="2" width="19" height="6" rx="1.5" stroke="white" strokeWidth="1" opacity="0.9" />
                <rect x="21" y="4.5" width="1" height="1" rx="0.5" fill="white" opacity="0.9" />
                <rect x="2" y="3" width="16" height="4" rx="0.5" fill="#34C759" />
              </svg>
            </div>
          </div>
          
          {/* App Content Area */}
          <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col">
            {children}
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-30" />
        </div>
        
        {/* Screen Reflection Effect */}
        <div className="absolute inset-3 rounded-[40px] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Phone Shadow */}
      <div className="absolute inset-0 rounded-[50px] shadow-2xl" 
           style={{ 
             boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.5), 0 25px 50px -25px rgba(0, 0, 0, 0.6)' 
           }} 
      />
    </div>
  );
};