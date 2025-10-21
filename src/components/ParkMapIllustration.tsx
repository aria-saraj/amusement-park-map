interface Location {
  id: string;
  x: number;
  y: number;
  category: string;
  name: string;
}

interface ParkMapIllustrationProps {
  locations: Location[];
  selectedCategory: string | null;
  onSelectLocation: (location: Location) => void;
  selectedLocation: Location | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  attraksjon: '#A855F7',
  mat: '#F97316',
  wc: '#3B82F6',
  firstaid: '#EF4444',
  show: '#EC4899',
};

const CATEGORY_EMOJI: Record<string, string> = {
  attraksjon: '🎢',
  mat: '🍔',
  wc: '🚻',
  firstaid: '🚑',
  show: '🎭',
};

export function ParkMapIllustration({ 
  locations, 
  selectedCategory, 
  onSelectLocation,
  selectedLocation 
}: ParkMapIllustrationProps) {
  const filteredLocations = selectedCategory
    ? locations.filter(loc => loc.category === selectedCategory)
    : locations;

  return (
    <svg width="100%" height="100%" viewBox="0 0 800 1200" className="w-full h-full">
      {/* Park background elements */}
      <defs>
        <pattern id="grass" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#34D399" opacity="0.1" />
          <circle cx="10" cy="10" r="1" fill="#34D399" opacity="0.3" />
          <circle cx="30" cy="25" r="1" fill="#34D399" opacity="0.3" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="800" height="1200" fill="#FEF9C3" />
      <rect width="800" height="1200" fill="url(#grass)" />

      {/* Paths/walkways */}
      <g opacity="0.4">
        <path d="M 100 100 Q 200 300 150 500 T 200 900" stroke="#D4D4D4" strokeWidth="30" fill="none" strokeLinecap="round" />
        <path d="M 700 100 Q 600 300 650 500 T 600 900" stroke="#D4D4D4" strokeWidth="30" fill="none" strokeLinecap="round" />
        <path d="M 100 600 Q 400 580 700 600" stroke="#D4D4D4" strokeWidth="30" fill="none" strokeLinecap="round" />
        <path d="M 150 300 Q 400 320 650 300" stroke="#D4D4D4" strokeWidth="30" fill="none" strokeLinecap="round" />
      </g>

      {/* Decorative trees */}
      <g opacity="0.3">
        <circle cx="120" cy="200" r="25" fill="#34D399" />
        <circle cx="680" cy="250" r="30" fill="#34D399" />
        <circle cx="150" cy="800" r="28" fill="#34D399" />
        <circle cx="650" cy="850" r="32" fill="#34D399" />
        <circle cx="400" cy="150" r="20" fill="#34D399" />
        <circle cx="550" cy="1000" r="25" fill="#34D399" />
      </g>

      {/* Location markers */}
      {filteredLocations.map((location) => {
        const color = CATEGORY_COLORS[location.category] || '#3B82F6';
        const emoji = CATEGORY_EMOJI[location.category] || '📍';
        const isSelected = selectedLocation?.id === location.id;
        const scale = isSelected ? 1.3 : 1;

        return (
          <g
            key={location.id}
            onClick={() => onSelectLocation(location)}
            style={{ cursor: 'pointer', transformOrigin: `${location.x}px ${location.y}px` }}
            className="transition-transform duration-200 hover:scale-110"
          >
            {/* Shadow */}
            <circle
              cx={location.x}
              cy={location.y + 3}
              r={20 * scale}
              fill="black"
              opacity="0.1"
            />
            
            {/* Pin background */}
            <circle
              cx={location.x}
              cy={location.y}
              r={20 * scale}
              fill={color}
              stroke="white"
              strokeWidth={3}
            />

            {/* Emoji */}
            <text
              x={location.x}
              y={location.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={16 * scale}
            >
              {emoji}
            </text>

            {/* Label on hover/selection */}
            {isSelected && (
              <>
                <rect
                  x={location.x - 60}
                  y={location.y - 50}
                  width={120}
                  height={28}
                  rx={14}
                  fill="white"
                  stroke={color}
                  strokeWidth={2}
                />
                <text
                  x={location.x}
                  y={location.y - 36}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fill="#334155"
                  fontWeight="600"
                >
                  {location.name}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
