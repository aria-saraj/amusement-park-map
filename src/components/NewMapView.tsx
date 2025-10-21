import { useState, useRef, useEffect } from 'react';
import { ParkMapIllustration } from './ParkMapIllustration';

interface Location {
  id: string;
  x: number;
  y: number;
  category: string;
  name: string;
}

interface NewMapViewProps {
  selectedCategory: string | null;
  onSelectLocation: (location: Location | null) => void;
  selectedLocation: Location | null;
}

// Park locations (coordinates relative to 800x1200 viewBox)
const PARK_LOCATIONS: Location[] = [
  // Attraksjoner
  { id: 'attr1', x: 200, y: 250, category: 'attraksjon', name: 'Speedmonster' },
  { id: 'attr2', x: 400, y: 400, category: 'attraksjon', name: 'Thundercoaster' },
  { id: 'attr3', x: 600, y: 300, category: 'attraksjon', name: 'Loopen' },
  { id: 'attr4', x: 300, y: 650, category: 'attraksjon', name: 'SuperSplash' },
  { id: 'attr5', x: 500, y: 800, category: 'attraksjon', name: 'Pariserhjul' },
  { id: 'attr6', x: 350, y: 950, category: 'attraksjon', name: 'VikingRaft' },
  
  // Mat
  { id: 'food1', x: 250, y: 450, category: 'mat', name: 'Burger Bar' },
  { id: 'food2', x: 550, y: 550, category: 'mat', name: 'Pizzeria' },
  { id: 'food3', x: 400, y: 750, category: 'mat', name: 'Iskiosk' },
  { id: 'food4', x: 200, y: 1000, category: 'mat', name: 'Café' },
  
  // WC
  { id: 'wc1', x: 150, y: 350, category: 'wc', name: 'WC Nord' },
  { id: 'wc2', x: 650, y: 450, category: 'wc', name: 'WC Øst' },
  { id: 'wc3', x: 300, y: 850, category: 'wc', name: 'WC Sør' },
  { id: 'wc4', x: 500, y: 600, category: 'wc', name: 'WC Sentrum' },
  
  // Førstehjelp
  { id: 'aid1', x: 400, y: 200, category: 'firstaid', name: 'Førstehjelp Nord' },
  { id: 'aid2', x: 450, y: 1050, category: 'firstaid', name: 'Førstehjelp Sør' },
  
  // Show
  { id: 'show1', x: 500, y: 350, category: 'show', name: 'Hovedscene' },
  { id: 'show2', x: 600, y: 700, category: 'show', name: 'Amfiteater' },
];

const MAP_WIDTH = 800;
const MAP_HEIGHT = 1200;
const MAX_PAN = 150; // Maximum pan distance in pixels

export function NewMapView({ selectedCategory, onSelectLocation, selectedLocation }: NewMapViewProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Constrain position within allowed pan range
  const constrainPosition = (x: number, y: number) => {
    return {
      x: Math.max(-MAX_PAN, Math.min(MAX_PAN, x)),
      y: Math.max(-MAX_PAN, Math.min(MAX_PAN, y)),
    };
  };

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div
        className="absolute inset-0 transition-transform duration-100"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <ParkMapIllustration
          locations={PARK_LOCATIONS}
          selectedCategory={selectedCategory}
          onSelectLocation={onSelectLocation}
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
}

export { PARK_LOCATIONS };
export type { Location };
