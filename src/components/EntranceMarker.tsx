import { DoorOpen } from 'lucide-react';

interface EntranceMarkerProps {
  x: number;
  y: number;
}

export function EntranceMarker({ x, y }: EntranceMarkerProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="bg-emerald-600 rounded-full p-2 shadow-lg border-2 border-white">
        <DoorOpen className="w-5 h-5 text-white" />
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-emerald-600 text-white px-2 py-1 rounded shadow-md whitespace-nowrap text-xs">
        Inngang
      </div>
    </div>
  );
}
