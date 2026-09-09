import React from 'react';
import { Shirt, Watch, Sparkles, Home, Grid } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const categories = [
    { id: 'All', label: 'All Items', icon: Grid, emoji: '✨' },
    { id: 'Fashion', label: 'Fashion', icon: Shirt, emoji: '👗' },
    { id: 'Electronics', label: 'Electronics', icon: Watch, emoji: '⚡' },
    { id: 'Beauty', label: 'Beauty', icon: Sparkles, emoji: '💄' },
    { id: 'Home & Living', label: 'Home & Living', icon: Home, emoji: '🛋️' },
  ];

  return (
    <section id="categories-section" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#b8860b]">
            Browse by Department
          </span>
          <h2 className="font-brand text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Shop by Category
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 sm:mt-0">
          Curated collections crafted with premium materials
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'All' ? Object.values(categoryCounts).reduce((a: number, b: number) => a + b, 0) : categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`category-btn-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 border ${
                isSelected
                  ? 'bg-[#b8860b] text-white border-[#b8860b] shadow-md shadow-amber-900/20 scale-[1.02]'
                  : 'bg-white text-stone-700 border-[#f3e9dc] hover:border-[#b8860b]/40 hover:bg-[#faf7f2]'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span className="font-semibold">{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-stone-100 text-stone-500 group-hover:bg-[#f3e9dc]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
