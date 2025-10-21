interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

interface NewCategorySelectorProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORIES: Category[] = [
  { id: 'attraksjon', label: 'Attraksjoner', emoji: '🎢', color: 'bg-purple-500' },
  { id: 'mat', label: 'Mat', emoji: '🍔', color: 'bg-orange-500' },
  { id: 'wc', label: 'WC', emoji: '🚻', color: 'bg-blue-500' },
  { id: 'firstaid', label: 'Førstehjelp', emoji: '🚑', color: 'bg-red-500' },
  { id: 'show', label: 'Show', emoji: '🎭', color: 'bg-pink-500' },
];

export function NewCategorySelector({ selectedCategory, onSelectCategory }: NewCategorySelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-2">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(isSelected ? null : category.id)}
            className={`
              flex-shrink-0 flex flex-col items-center justify-center gap-1 
              px-4 py-2 rounded-2xl transition-all
              ${isSelected 
                ? `${category.color} text-white shadow-lg scale-105` 
                : 'bg-white text-slate-700 shadow-md hover:shadow-lg'
              }
            `}
          >
            <span className="text-2xl">{category.emoji}</span>
            <span className="text-xs whitespace-nowrap">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
