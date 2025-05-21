import React from 'react';
import { CategoryType } from '../types';

interface CategoryButtonsProps {
  selectedCategory: CategoryType | string | null;
  onCategoryChange: (category: CategoryType | string | null) => void;
}

const CategoryButtons = ({ 
  selectedCategory, 
  onCategoryChange 
}: CategoryButtonsProps) => {
  const categories: CategoryType[] = ['10ml', '60ml', '120ml'];
  
  const getCategoryLabel = (category: CategoryType) => {
    switch(category) {
      case '10ml': return 'Fertigliquid 10ml';
      case '60ml': return 'Longfill 60ml';
      case '120ml': return 'Longfill 120ml';
      default: return category;
    }
  };
  
  // Farben für jede Kategorie
  const getCategoryColor = (category: CategoryType) => {
    switch(category) {
      case '10ml': return 'text-blue-400';
      case '60ml': return 'text-green-400';
      case '120ml': return 'text-purple-400';
      default: return 'text-gray-200';
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-5 py-3 rounded-xl transition-all shadow-md backdrop-blur-sm ${
            selectedCategory === category 
              ? `bg-black/30 border-white/30 border-2 text-white font-bold` 
              : 'bg-black/20 border border-white/10 text-white hover:bg-black/25 hover:border-white/20'
          }`}
          aria-pressed={selectedCategory === category}
          aria-label={`Kategorie ${getCategoryLabel(category)}`}
        >
          {getCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons; 