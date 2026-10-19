import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../api/axios';
import Page from '../components/Page';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const SORTS = [
  { value: '-rating', label: 'Top rated' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: '-createdAt', label: 'Newest' },
];

export default function Menu() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-rating');
  const activeCat = params.get('category') || 'all';

  useEffect(() => {
    api.get('/api/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (activeCat !== 'all') q.set('category', activeCat);
    q.set('sort', sort);
    api
      .get(`/api/products?${q}`)
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCat, sort]);

  const visible = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  const pickCategory = (id) => {
    if (id === 'all') params.delete('category');
    else params.set('category', id);
    setParams(params, { replace: true });
  };

  return (
    <Page className="container-x py-12">
      <SectionHeader script="The full spread" title="Our Menu" sub="Filter by craving, search by name — everything is made fresh to order." />

      {/* category pills */}
      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        {[{ _id: 'all', name: 'All dishes' }, ...categories].map((c) => (
          <button
            key={c._id}
            onClick={() => pickCategory(c._id)}
            className={`relative rounded-full px-5 py-2 text-sm transition-all duration-300 ${
              activeCat === c._id
                ? 'text-ink'
                : 'border border-white/10 text-cream/80 hover:border-gold/50 hover:text-gold'
            }`}
          >
            {activeCat === c._id && (
              <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', damping: 26, stiffness: 300 }} />
            )}
            <span className="relative z-10">{c.name}</span>
          </button>
        ))}
      </div>

      {/* search + sort */}
      <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a dish…"
            className="input !pl-11"
            aria-label="Search dishes"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-full appearance-none !pl-11 sm:w-52" aria-label="Sort dishes">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader label="Plating the menu…" />
      ) : visible.length === 0 ? (
        <div className="py-20 text-center text-muted">
          <p className="font-display text-xl text-cream">Nothing matched that craving.</p>
          <p className="mt-2 text-sm">Try a different search, or clear the category filter.</p>
        </div>
      ) : (
        <motion.div layout className="mt-24 grid gap-x-6 gap-y-28 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </AnimatePresence>
        </motion.div>
      )}
    </Page>
  );
}
