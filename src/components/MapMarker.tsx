import { FerrisWheel, Utensils, Bath, Cross, Theater } from 'lucide-react';

interface Location {
  id: string;
  x: number;
  y: number;
  category: string;
  name: string;
}

interface MapMarkerProps {
  location: Location;
  isHighlighted: boolean;
  isSelected: boolean;
}

const CATEGORY_ICONS = {
  attraksjon: FerrisWheel,
  mat: Utensils,
  wc: Bath,
  firstaid: Cross,
  show: Theater,
};

const CATEGORY_COLORS = {
  attraksjon: 'bg-purple-500',
  mat: 'bg-orange-500',
  wc: 'bg-blue-500',
  firstaid: 'bg-red-500',
  show: 'bg-pink-500',
};

export function MapMarker({ location, isHighlighted, isSelected }: MapMarkerProps) {
  const Icon = CATEGORY_ICONS[location.category as keyof typeof CATEGORY_ICONS];
  const colorClass = CATEGORY_COLORS[location.category as keyof typeof CATEGORY_COLORS];
  
  const opacity = isSelected && !isHighlighted ? 0.3 : 1;
  const scale = isHighlighted ? 1.2 : 1;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${location.x}px`,
        top: `${location.y}px`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <div className={`${colorClass} rounded-full p-2 shadow-lg border-2 border-white`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {isHighlighted && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-md whitespace-nowrap text-xs">
          {location.name}
        </div>
      )}
    </div>
  );
}
