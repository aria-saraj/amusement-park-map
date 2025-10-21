interface DistanceBubbleProps {
  distance: number;
  targetName: string;
  compassDistance?: number; // Optional distance from compass position
  showCompassDistance?: boolean; // Whether to show compass distance
}

export function DistanceBubble({ distance, targetName, compassDistance, showCompassDistance }: DistanceBubbleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Main distance bubble - from fixed position */}
      <div className="bg-white px-6 py-3 rounded-full shadow-lg border-2 border-[#3B82F6]">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 text-sm">{targetName}</span>
          <span className="text-[#3B82F6]">•</span>
          <span className="text-slate-900">{distance} m</span>
        </div>
      </div>

      {/* Compass distance bubble - only shown when compass is active */}
      {showCompassDistance && compassDistance !== undefined && compassDistance > 0 && (
        <div className="bg-[#3B82F6] px-5 py-2 rounded-full shadow-lg border-2 border-white">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Fra kompass</span>
            <span className="text-white">•</span>
            <span className="text-white">{compassDistance} m</span>
          </div>
        </div>
      )}
    </div>
  );
}
