import { useState, useRef } from 'react';
import { MapView } from './components/MapView';
import { CategorySelector } from './components/CategorySelector';
import { UserMarker } from './components/UserMarker';
import { DistanceBubble } from './components/DistanceBubble';
import { Compass, MapPin } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [compassEnabled, setCompassEnabled] = useState(false);
  const [targetDirection, setTargetDirection] = useState(0);
  const [distance, setDistance] = useState(0); // Distance from fixed user position
  const [compassDistance, setCompassDistance] = useState(0); // Distance from compass position
  const recenterRef = useRef<{ recenterFunc?: () => void }>({});

  const toggleCompass = () => {
    setCompassEnabled(!compassEnabled);
  };

  const handleRecenter = () => {
    if (recenterRef.current.recenterFunc) {
      recenterRef.current.recenterFunc();
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-200 flex items-center justify-center p-4">
      {/* iPhone 14 Pro frame - 390x844 */}
      <div className="relative w-full max-w-[390px] h-[844px] max-h-[90vh] bg-[#FEF9C3] shadow-2xl overflow-hidden rounded-[3rem] border-8 border-slate-900">
        
        {/* Header with category selector */}
        <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#FEF9C3] via-[#FEF9C3] to-transparent pb-4">
          <div className="pt-12 pb-2 px-4">
            <h1 className="text-center text-slate-800 mb-3">Tusenfryd Kart</h1>
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>

        {/* Map area */}
        <div className="absolute inset-0 top-[140px] bottom-[100px]">
          <MapView 
            selectedCategory={selectedCategory}
            compassEnabled={compassEnabled}
            onDirectionChange={setTargetDirection}
            onDistanceChange={setDistance}
            onCompassDistanceChange={setCompassDistance}
            onRecenter={recenterRef.current}
          />
        </div>

        {/* User position marker (always in center) */}
        <UserMarker compassEnabled={compassEnabled} direction={targetDirection} />

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#FEF9C3] via-[#FEF9C3] to-transparent pt-6 pb-8">
          <div className="px-4 space-y-3">
            {/* Distance bubble - only show when category is selected */}
            {selectedCategory && distance > 0 && (
              <DistanceBubble
                distance={distance}
                targetName="Nærmeste lokasjon"
                compassDistance={compassDistance}
                showCompassDistance={compassEnabled}
              />
            )}

            {/* Button row */}
            <div className="flex justify-center gap-3">
              {/* Recenter button */}
              <button
                onClick={handleRecenter}
                className="flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 active:scale-95"
              >
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Nåværende posisjon</span>
              </button>

              {/* Compass toggle button */}
              <button
                onClick={toggleCompass}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all
                  ${compassEnabled 
                    ? 'bg-[#3B82F6] text-white' 
                    : 'bg-white text-slate-700 border-2 border-slate-300'
                  }
                `}
              >
                <Compass className="w-5 h-5" />
                <span className="text-sm">
                  {compassEnabled ? 'Kompass På' : 'Aktiver Kompass'}
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}