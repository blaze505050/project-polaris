import React, { useState, useCallback, useMemo } from 'react';
import { Search, X, Filter, ChevronDown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { debounce } from '@/services/performanceOptimization';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
  categories: string[];
  difficulties: string[];
  onAdvancedSearch?: (config: any) => void;
}

export default function SearchAndFilter({
  onSearch,
  onFilterChange,
  categories,
  difficulties,
  onAdvancedSearch,
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    category: [],
    difficulty: [],
  });

  // Debounced search for performance
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleFilterToggle = (filterType: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[filterType] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      
      const newFilters = { ...prev, [filterType]: updated };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilters({ category: [], difficulty: [] });
    onSearch('');
    onFilterChange({ category: [], difficulty: [] });
  };

  const activeFilterCount = Object.values(activeFilters).flat().length;

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aerospace-blue/60" />
        <input
          type="text"
          placeholder="Search tools, templates, and resources..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-primary border border-secondary/30 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-aerospace-blue/60 transition-colors font-paragraph"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle & Active Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary/20 border border-secondary/40 rounded-lg text-foreground hover:border-aerospace-blue/50 transition-colors font-paragraph text-sm"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-aerospace-blue/20 text-aerospace-blue rounded text-xs font-mono font-bold">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Advanced Search Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue/10 border border-aerospace-blue/30 rounded-lg text-aerospace-blue hover:bg-aerospace-blue/20 transition-colors font-paragraph text-sm"
        >
          <Zap className="w-4 h-4" />
          Advanced
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-aerospace-blue hover:text-aerospace-accent text-sm font-mono transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 bg-primary border border-secondary/30 rounded-lg space-y-6"
        >
          {/* Category Filter */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
              Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.category?.includes(cat) || false}
                    onChange={() => handleFilterToggle('category', cat)}
                    className="w-4 h-4 rounded border-secondary/40 bg-aerospace-dark accent-aerospace-blue cursor-pointer"
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-aerospace-blue transition-colors font-paragraph">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
              Difficulty
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {difficulties.map((diff) => (
                <label
                  key={diff}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.difficulty?.includes(diff) || false}
                    onChange={() => handleFilterToggle('difficulty', diff)}
                    className="w-4 h-4 rounded border-secondary/40 bg-aerospace-dark accent-aerospace-blue cursor-pointer"
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-aerospace-blue transition-colors font-paragraph">
                    {diff}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Advanced Search Panel */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 bg-primary border border-aerospace-blue/30 rounded-lg space-y-4"
        >
          <h3 className="font-heading text-sm font-bold text-aerospace-blue uppercase tracking-wider">
            Advanced Search Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-foreground/70 mb-2">
                Search Type
              </label>
              <select className="w-full px-3 py-2 bg-aerospace-dark border border-secondary/30 rounded text-foreground text-sm">
                <option>Contains</option>
                <option>Exact Match</option>
                <option>Starts With</option>
                <option>Fuzzy Match</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-foreground/70 mb-2">
                Sort By
              </label>
              <select className="w-full px-3 py-2 bg-aerospace-dark border border-secondary/30 rounded text-foreground text-sm">
                <option>Relevance</option>
                <option>Name (A-Z)</option>
                <option>Newest</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-foreground/50 font-mono">
            💡 Tip: Use fuzzy matching for typo-tolerant searches
          </p>
        </motion.div>
      )}
    </div>
  );
}
