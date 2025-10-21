import { ArrowDown } from 'lucide-react';

interface DirectionalArrowProps {
  angle: number;
  distance: number;
}

export function DirectionalArrow({ angle, distance }: DirectionalArrowProps) {
  // Convert radians to degrees
  const degrees = (angle * 180) / Math.PI;

  return (
    <div className="absolute top-1/2 left-1/2 pointer-events-none z-10">
      <div 
        className="flex flex-col items-center gap-2"
        style={{
          transform: `translate(-50%, -50%) rotate(${degrees}deg)`,
        }}
      >
        <div className="bg-slate-800 rounded-full p-4 shadow-2xl animate-pulse">
          <ArrowDown className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
        <div 
          className="bg-white px-4 py-2 rounded-full shadow-lg border-2 border-slate-800"
          style={{
            transform: `rotate(${-degrees}deg)`,
          }}
        >
          <span className="text-slate-800">{distance} m</span>
        </div>
      </div>
    </div>
  );
}
