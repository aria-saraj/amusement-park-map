import { Navigation } from 'lucide-react';

interface UserMarkerProps {
  compassEnabled: boolean;
  direction: number; // angle in degrees
}

export function UserMarker({ compassEnabled, direction }: UserMarkerProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
      {/* Outer pulse ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full bg-[#3B82F6] opacity-20 animate-ping" />
      </div>
      
      {/* Main blue circle */}
      <div className="relative w-12 h-12 rounded-full bg-[#3B82F6] border-4 border-white shadow-lg flex items-center justify-center">
        {compassEnabled && (
          <div 
            className="transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${direction}deg)` }}
          >
            <Navigation className="w-6 h-6 text-white fill-white" />
          </div>
        )}
      </div>
    </div>
  );
}
