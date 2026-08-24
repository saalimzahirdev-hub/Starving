import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import MenuCard from '../../components/ui/MenuCard';
import DealCard from '../../components/ui/DealCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { menuService } from '../../services/menuService';
import { categories } from '../../data/menuData';
import { useDebounce } from '../../hooks/useDebounce';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured'        },
  { value: 'price-asc',  label: 'Price: Low–High'  },
  { value: 'price-desc', label: 'Price: High–Low'  },
  { value: 'popular',    label: 'Popular First'    },
  { value: 'name',       label: 'Name A–Z'         },
];

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [sortOpen, setSortOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'all'
  );

  const debouncedSearch = useDebounce(search, 280);

  // Load menu items
  useEffect(() => {
    const loadItems = () => setItems(menuService.getAll());

    setLoading(true);
    const timer = setTimeout(() => {
      loadItems();
      setLoading(false);
    }, 400);

    const handleStorage = (e) => {
      if (e.key === 'starving_menu') {
        loadItems();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Sync category from URL param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  // Filtered + sorted items
  const filtered = useMemo(() => {
    let result = [...items];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(i => i.category === activeCategory);
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.variants[0].price - b.variants[0].price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.variants[0].price - a.variants[0].price);
        break;
      case 'popular':
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // featured first
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [items, activeCategory, debouncedSearch, sort]);

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort';

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10 mb-6"
        >
          <span className="section-tag">Explore</span>
          <h1 className="section-title">Our Full Menu</h1>
          <p className="section-subtitle mx-auto text-center mt-2">
            {items.length} dishes across {categories.length - 1} categories — every one crafted for royalty.
          </p>
        </motion.div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 pr-10"
              id="menu-search"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(o => !o)}
              className="flex items-center gap-2 input-field w-full sm:w-auto px-4 py-3 justify-between"
              id="menu-sort"
            >
              <SlidersHorizontal size={15} className="text-brand-gold" />
              <span className="text-sm">{activeSortLabel}</span>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-1 w-48 rounded-xl overflow-hidden z-20"
                  style={{ background: 'var(--surface-card)', border: '1px solid var(--border-gold)' }}
                >
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSort(opt.value); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sort === opt.value
                          ? 'text-brand-gold bg-brand-gold/10'
                          : 'text-white/65 hover:bg-white/5'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-brand-gold text-surface border border-brand-gold'
                  : 'bg-surface-card text-white/60 border border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-white/35 text-sm mb-5">
            {filtered.length === 0
              ? 'No items found'
              : `${filtered.length} item${filtered.length !== 1 ? 's' : ''} found`}
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-20 text-center"
          >
            <span className="text-6xl">🍽️</span>
            <h3 className="font-brand text-xl text-white/60">No dishes found</h3>
            <p className="text-white/35 text-sm">
              {debouncedSearch ? 'Try a different search term.' : 'This category appears to be empty right now.'}
            </p>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); }} className="btn-outline-gold text-xs py-2 px-5">
              Clear Filters
            </button>
          </motion.div>
        ) : activeCategory === 'Deals' ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <DealCard key={item.id} deal={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                item.category === 'Deals' ? (
                  <div key={item.id} className="col-span-2 sm:col-span-2 lg:col-span-2">
                    <DealCard deal={item} index={i} />
                  </div>
                ) : (
                  <MenuCard key={item.id} product={item} index={i} />
                )
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* No-scrollbar utility */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
    </div>
  );
}
