import { useState, useRef } from 'react';
import * as React from 'react';
import { MapMarker } from './MapMarker';
import { EntranceMarker } from './EntranceMarker';
import tusenfrydMap from 'figma:asset/22a69cdabfed8c92f75903eefb09d8a565841456.png';

interface Location {
  id: string;
  x: number;
  y: number;
  category: string;
  name: string;
}

// Tusenfryd locations (coordinates are relative to map image)
// Map dimensions scaled to 1800x1200 (1.5x zoom)
const LOCATIONS: Location[] = [
  // Attraksjoner
  { id: 'attr1', x: 375, y: 450, category: 'attraksjon', name: 'SpeedMonster' },
  { id: 'attr2', x: 825, y: 375, category: 'attraksjon', name: 'Thundercoaster' },
  { id: 'attr3', x: 900, y: 675, category: 'attraksjon', name: 'Loopen' },
  { id: 'attr4', x: 525, y: 825, category: 'attraksjon', name: 'VikingRaft' },
  { id: 'attr5', x: 1350, y: 600, category: 'attraksjon', name: 'StorBåt' },
  { id: 'attr6', x: 675, y: 300, category: 'attraksjon', name: 'Pariserhjul' },
  
  // Mat
  { id: 'food1', x: 975, y: 450, category: 'mat', name: 'Hovedrestaurant' },
  { id: 'food2', x: 600, y: 675, category: 'mat', name: 'Restaurant Vest' },
  { id: 'food3', x: 1200, y: 525, category: 'mat', name: 'Burger Bar' },
  { id: 'food4', x: 1125, y: 600, category: 'mat', name: 'Kiosk Sentrum' },
  { id: 'food5', x: 450, y: 600, category: 'mat', name: 'Café Vest' },
  { id: 'food6', x: 900, y: 825, category: 'mat', name: 'Iskiosk' },
  
  // WC
  { id: 'wc1', x: 450, y: 300, category: 'wc', name: 'WC Nord' },
  { id: 'wc2', x: 1050, y: 525, category: 'wc', name: 'WC Sentrum' },
  { id: 'wc3', x: 750, y: 900, category: 'wc', name: 'WC Sør' },
  { id: 'wc4', x: 1275, y: 675, category: 'wc', name: 'WC Øst' },
  
  // Førstehjelp
  { id: 'aid1', x: 900, y: 300, category: 'firstaid', name: 'Førstehjelp Nord' },
  { id: 'aid2', x: 750, y: 1000, category: 'firstaid', name: 'Førstehjelp Sør' },
  
  // Show
  { id: 'show1', x: 975, y: 525, category: 'show', name: 'Hovedscene' },
  { id: 'show2', x: 1050, y: 750, category: 'show', name: 'Amfiteater' },
];

const MAP_WIDTH = 1800;
const MAP_HEIGHT = 1200;

// User's current position - centrally located on a pathway
const USER_POSITION = { x: 650, y: 475 };

// Entrance position (for entrance marker)
const ENTRANCE_POSITION = { x: 900, y: 1000 };

interface MapViewProps {
  selectedCategory: string | null;
  compassEnabled: boolean;
  onDirectionChange: (direction: number) => void;
  onDistanceChange: (distance: number) => void;
  onCompassDistanceChange: (distance: number) => void;
  onRecenter: { recenterFunc?: () => void };
}

export function MapView({ selectedCategory, compassEnabled, onDirectionChange, onDistanceChange, onCompassDistanceChange, onRecenter }: MapViewProps) {
  // Calculate initial position to center user position in viewport
  const getInitialPosition = () => {
    // Assuming viewport is roughly 390px wide and 600px tall
    return {
      x: (390 / 2) - USER_POSITION.x,
      y: (600 / 2) - USER_POSITION.y,
    };
  };

  const [position, setPosition] = useState(getInitialPosition());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Constrain position within map bounds
  const constrainPosition = (x: number, y: number) => {
    if (!containerRef.current) return { x, y };
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const minX = containerRect.width - MAP_WIDTH;
    const minY = containerRect.height - MAP_HEIGHT;
    
    return {
      x: Math.max(minX, Math.min(0, x)),
      y: Math.max(minY, Math.min(0, y)),
    };
  };

  // Function to recenter map to user position
  const recenterToUser = React.useCallback(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newPos = constrainPosition(
        (containerRect.width / 2) - USER_POSITION.x,
        (containerRect.height / 2) - USER_POSITION.y
      );
      setPosition(newPos);
    }
  }, []);

  // Expose recenter function to parent
  React.useEffect(() => {
    onRecenter.recenterFunc = recenterToUser;
  }, [recenterToUser, onRecenter]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPos = constrainPosition(
        e.clientX - dragStart.x,
        e.clientY - dragStart.y
      );
      setPosition(newPos);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const newPos = constrainPosition(
        touch.clientX - dragStart.x,
        touch.clientY - dragStart.y
      );
      setPosition(newPos);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Get locations for selected category
  const selectedLocations = selectedCategory
    ? LOCATIONS.filter(loc => loc.category === selectedCategory)
    : [];

  // Check if any selected location is visible
  const isAnyLocationVisible = () => {
    if (!containerRef.current || selectedLocations.length === 0) return true;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    return selectedLocations.some(loc => {
      const markerX = position.x + loc.x;
      const markerY = position.y + loc.y;
      
      return (
        markerX >= 0 &&
        markerX <= containerRect.width &&
        markerY >= 0 &&
        markerY <= containerRect.height
      );
    });
  };

  // Calculate direction and distance to nearest selected location from USER_POSITION (fixed position)
  const getDirectionAndDistanceFromUserPosition = () => {
    if (selectedLocations.length === 0) return null;

    // Find nearest location from USER_POSITION, excluding the user's current location
    let nearest = null;
    let minDistance = Infinity;

    selectedLocations.forEach(loc => {
      // Skip if location is at user's exact position
      if (loc.x === USER_POSITION.x && loc.y === USER_POSITION.y) {
        return;
      }

      const distance = Math.sqrt(
        Math.pow(loc.x - USER_POSITION.x, 2) + Math.pow(loc.y - USER_POSITION.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = loc;
      }
    });

    // If no valid location found (all at user position), return null
    if (!nearest) return null;

    // Calculate angle from USER_POSITION to nearest location
    const angle = Math.atan2(
      nearest.y - USER_POSITION.y, 
      nearest.x - USER_POSITION.x
    );
    
    // Convert pixel distance to approximate meters (assuming 1 pixel ≈ 1.5 meters for a theme park)
    const distanceInMeters = Math.round(minDistance * 1.5);

    return { angle, distance: distanceInMeters, nearest };
  };

  // Calculate direction and distance to nearest selected location from viewport center (compass position)
  const getDirectionAndDistanceFromCompass = () => {
    if (!containerRef.current || selectedLocations.length === 0) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportCenterX = containerRect.width / 2;
    const viewportCenterY = containerRect.height / 2;

    // Convert viewport center to map coordinates
    const mapCenterX = viewportCenterX - position.x;
    const mapCenterY = viewportCenterY - position.y;

    // Find nearest location from viewport center
    let nearest = selectedLocations[0];
    let minDistance = Infinity;

    selectedLocations.forEach(loc => {
      const distance = Math.sqrt(
        Math.pow(loc.x - mapCenterX, 2) + Math.pow(loc.y - mapCenterY, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = loc;
      }
    });

    // Calculate angle from viewport center to nearest location
    const angle = Math.atan2(
      nearest.y - mapCenterY, 
      nearest.x - mapCenterX
    );
    
    // Convert pixel distance to approximate meters
    const distanceInMeters = Math.round(minDistance * 1.5);

    return { angle, distance: distanceInMeters, nearest };
  };

  // Update direction and distances when category is selected or map position changes
  React.useEffect(() => {
    if (selectedCategory) {
      // Always calculate distance from fixed user position
      const userPositionData = getDirectionAndDistanceFromUserPosition();
      if (userPositionData) {
        onDistanceChange(userPositionData.distance);
      }

      // When compass is enabled, also calculate from compass position
      if (compassEnabled) {
        const compassData = getDirectionAndDistanceFromCompass();
        if (compassData) {
          // Convert radians to degrees and adjust for Navigation icon pointing up (0 degrees = up)
          const degrees = (compassData.angle * 180 / Math.PI) + 90;
          onDirectionChange(degrees);
          onCompassDistanceChange(compassData.distance);
        }
      } else {
        onDirectionChange(0);
        onCompassDistanceChange(0);
      }
    } else {
      onDirectionChange(0);
      onDistanceChange(0);
      onCompassDistanceChange(0);
    }
  }, [position, selectedCategory, compassEnabled]);

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Map background */}
      <div
        className="absolute"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${MAP_WIDTH}px`,
          height: `${MAP_HEIGHT}px`,
        }}
      >
        {/* Tusenfryd Map Image */}
        <img 
          src={tusenfrydMap} 
          alt="Tusenfryd Kart" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          draggable={false}
        />

        {/* Entrance marker */}
        <EntranceMarker x={ENTRANCE_POSITION.x} y={ENTRANCE_POSITION.y} />

        {/* Location markers */}
        {LOCATIONS.map(location => (
          <MapMarker
            key={location.id}
            location={location}
            isHighlighted={selectedCategory === location.category}
            isSelected={selectedCategory !== null}
          />
        ))}
      </div>
    </div>
  );
}

export { LOCATIONS, USER_POSITION };
export type { Location };