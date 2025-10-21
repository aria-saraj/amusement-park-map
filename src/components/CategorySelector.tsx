import { FerrisWheel, Utensils, Bath, Cross, Theater } from 'lucide-react';
import { Button } from './ui/button';

interface CategorySelectorProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORIES = [
  { id: 'attraksjon', label: 'Attraksjoner', icon: FerrisWheel, color: 'bg-purple-500 hover:bg-purple-600' },
  { id: 'mat', label: 'Mat', icon: Utensils, color: 'bg-orange-500 hover:bg-orange-600' },
  { id: 'wc', label: 'WC', icon: Bath, color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'firstaid', label: 'Førstehjelp', icon: Cross, color: 'bg-red-500 hover:bg-red-600' },
  { id: 'show', label: 'Show', icon: Theater, color: 'bg-pink-500 hover:bg-pink-600' },
];

export function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-1">
      {CATEGORIES.map(category => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(isSelected ? null : category.id)}
            className={`
              flex-shrink-0 flex flex-col items-center justify-center gap-1 
              px-3 py-2 rounded-2xl transition-all shadow-md
              ${isSelected 
                ? `${category.color} text-white scale-105` 
                : 'bg-white text-slate-700 hover:shadow-lg'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] whitespace-nowrap">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
