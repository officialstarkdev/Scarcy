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
  const [premium, setPremium] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPremium, setLoadingPremium] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-rating');
  const activeCat = params.get('category') || 'all';

  useEffect(() => {
    api.get('/api/categories').then(({ data }) => setCategories(data)).catch(() => {});
    api
      .get('/api/products?sort=-rating')
      .then(({ data }) => setPremium(data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoadingPremium(false));
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
    <Page>
      {/* ── Page banner ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-forestsoft/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-sage/10 blur-3xl" />
        <div className="container-x relative py-16 text-center sm:py-20">
          <p className="eyebrow-light">The full spread</p>
          <h1 className="h-display-light mt-4 text-4xl sm:text-5xl">Our Menu</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/70">
            Filter by craving or search by name — everything is cooked fresh, to order.
          </p>
        </div>
      </section>

      {/* ── Premium selection ────────────────────────────────── */}
      <section className="border-b border-sand bg-white py-16">
        <div className="container-x">
          <SectionHeader
            script="Handpicked by our chefs"
            title="Premium Selection"
            sub="Our highest rated plates — the ones guests come back for."
          />
          {loadingPremium ? (
            <Loader label="Loading the premium list…" />
          ) : premium.length === 0 ? (
            <p className="py-14 text-center text-sm text-muted">Nothing here yet — check back soon.</p>
          ) : (
            <div className="mt-12 grid gap-3.5 lg:grid-cols-2">
              {premium.map((p, i) => <ProductCard key={p._id} product={p} index={i} variant="row" />)}
            </div>
          )}
        </div>
      </section>

      {/* ── A la carte ───────────────────────────────────────── */}
      <section className="container-x py-16">
        <SectionHeader script="Order your favourites" title="A La Carte Menu" />

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {[{ _id: 'all', name: 'All Dishes' }, ...categories].map((c) => (
            <button
              key={c._id}
              onClick={() => pickCategory(c._id)}
              className={`relative rounded-full px-5 py-2 text-[13px] transition-all duration-300 ${
                activeCat === c._id
                  ? 'text-cream'
                  : 'border border-sand bg-white text-muted hover:border-forest/40 hover:text-forest'
              }`}
            >
              {activeCat === c._id && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-forest"
                  transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{c.name}</span>
            </button>
          ))}
        </div>

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
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input w-full appearance-none !pl-11 sm:w-56"
              aria-label="Sort dishes"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <Loader label="Plating the menu…" />
        ) : visible.length === 0 ? (
          <div className="py-20 text-center text-muted">
            <p className="font-display text-xl text-forest">Nothing matched that craving.</p>
            <p className="mt-2 text-sm">Try a different search, or clear the category filter.</p>
          </div>
        ) : (
          <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </Page>
  );
}
