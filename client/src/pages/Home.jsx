import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Award, Bike, ChefHat, Check, Clock, Leaf, MapPin, PhoneCall, Play, Smile, Star, Users, UtensilsCrossed,
} from 'lucide-react';
import api from '../api/axios';
import Page from '../components/Page';
import Reveal from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const HERO_IMG = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=80';
const RESERVE_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';

const FEATURES = [
  { icon: Leaf, title: 'Fresh Ingredients', text: 'Daily fresh from local farms' },
  { icon: ChefHat, title: 'Expert Chefs', text: 'Culinary masters at work' },
  { icon: Bike, title: 'Free Delivery', text: 'On orders above Rs 2,500' },
  { icon: Users, title: 'Good for Groups', text: 'Perfect for gatherings' },
  { icon: Smile, title: 'Happy Customers', text: '12k+ five-star reviews' },
];

const STATS = [
  { icon: Award, value: '12+', label: 'Years of Excellence' },
  { icon: Users, value: '25k+', label: 'Happy Customers' },
  { icon: UtensilsCrossed, value: '120+', label: 'Dishes & Drinks' },
  { icon: MapPin, value: '05', label: 'Prime Locations' },
  { icon: Star, value: '4.8', label: 'Average Rating' },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    setLoadingCategories(true);
    api
      .get('/api/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoadingCategories(false));

    setLoadingFeatured(true);
    api
      .get('/api/products?featured=true')
      .then(({ data }) => {
        if (data.length) return setFeatured(data.slice(0, 4));
        // nothing flagged as featured yet — fall back to the best rated dishes
        return api.get('/api/products?sort=-rating').then((res) => setFeatured(res.data.slice(0, 4)));
      })
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <Page>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0D2319] text-[#FBF9F3] pt-4 pb-16 lg:pt-6 lg:pb-24">
        {/* Soft radial glow behind the plate on the right */}
        <div className="pointer-events-none absolute right-[10%] top-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-[#1A3D2D]/60 blur-[130px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[#143324]/40 blur-[140px]" />

        <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.18fr,1fr] lg:gap-6">
          {/* Left Column: Typography & CTAs */}
          <div className="relative z-10 lg:pr-4">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-[44px] font-normal text-[#CDE090] tracking-wide"
              style={{ fontFamily: '"Alex Brush", "Great Vibes", cursive' }}
            >
              Good Food, Great Mood
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-3 font-display text-[40px] leading-[1.1] sm:text-5xl lg:text-[58px] xl:text-[64px] font-normal tracking-tight text-white"
            >
              <span className="block whitespace-nowrap">Experience Food</span>
              <span className="block whitespace-nowrap">That Feels Like</span>
              <span
                className="font-normal text-[#D6E898] text-[74px] sm:text-[92px] lg:text-[114px] leading-[0.88] block pt-2 -ml-1"
                style={{ fontFamily: '"Alex Brush", "Great Vibes", cursive' }}
              >
                Home
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-6 max-w-lg text-[15px] sm:text-base leading-relaxed text-[#9EB3A6]"
            >
              From fresh ingredients to unforgettable flavors, we serve meals that warm your heart and satisfy your soul.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/menu"
                className="group inline-flex items-center gap-2 rounded-full bg-[#D6E898] px-7 py-3.5 text-sm font-semibold text-[#12281D] transition-all duration-300 hover:bg-[#c8dc87] hover:shadow-[0_8px_22px_rgba(214,232,152,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Our Menu</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="tel:04211192472"
                className="group inline-flex items-center gap-3 rounded-full border border-[#C08A2E] bg-transparent px-7 py-3 text-base font-semibold text-[#DE9E36] transition-all duration-300 hover:border-[#F3B74B] hover:text-[#F3B74B] hover:shadow-[0_0_20px_rgba(222,158,54,0.22)] active:scale-[0.98]"
                aria-label="Call 042-111-924-72"
              >
                <PhoneCall size={18} className="text-[#DE9E36] transition-transform group-hover:scale-110 group-hover:text-[#F3B74B]" />
                <span className="font-price tracking-wide">042-111-924-72</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Signature Platter Composition */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px] xl:max-w-[530px]">
              
              {/* Giant Light Lime Crescent Arc backdrop behind the plate */}
              <div
                className="pointer-events-none absolute -right-8 sm:-right-12 lg:-right-16 top-12 sm:top-16 w-[94%] sm:w-[98%] aspect-square rounded-full bg-[#D6E898] shadow-lg"
              />

              {/* Concentric Dark Forest Green Underplate / Charger Base */}
              <div className="absolute -inset-3 sm:-inset-4 z-[5] rounded-full bg-[#153828] border border-[#24503B]/70 shadow-[0_20px_50px_rgba(0,0,0,0.7)]" />

              {/* The Main Round Matte Black Plate with Grilled Salmon Dish */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="relative z-10 h-full w-full rounded-full overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] border-4 border-[#18201a]"
              >
                <img
                  src="/hero/salmon_plate.jpg"
                  alt="Signature grilled salmon with blistered cherry tomatoes and baby arugula"
                  className="h-full w-full object-cover rounded-full"
                />
              </motion.div>

              {/* Floating Badge 1: Top-Right Fresh Basil Leaf */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[3%] right-[20%] z-20 h-12 w-12 sm:h-14 sm:w-14 rounded-full p-1 bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_8px_25px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <img
                  src="/hero/leaf_badge.jpg"
                  alt="Fresh organic garnish"
                  className="h-full w-full rounded-full object-cover"
                />
              </motion.div>

              {/* Floating Badge 2: Top-Right Seasoning & Spices Bowl */}
              <motion.div
                animate={{ y: [0, 6, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute top-[16%] -right-2 sm:-right-3 z-20 h-10 w-10 sm:h-11 sm:w-11 rounded-full p-0.5 bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_8px_25px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <img
                  src="/hero/spice_badge.jpg"
                  alt="Artisanal seasoning"
                  className="h-full w-full rounded-full object-cover"
                />
              </motion.div>

              {/* Floating Badge 3: Bottom-Left Frosted Glass Leaf */}
              <motion.div
                animate={{ y: [0, -5, 0], rotate: [0, -4, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-[3%] left-[12%] z-20 h-11 w-11 sm:h-12 sm:w-12 rounded-full p-1 bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_8px_25px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <img
                  src="/hero/leaf_badge.jpg"
                  alt="Organic leaf accent"
                  className="h-full w-full rounded-full object-cover -rotate-45"
                />
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Feature strip ────────────────────────────────────── */}
      <section className="border-b border-sand bg-white">
        <div className="container-x grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-creamdeep text-forest">
                <f.icon size={19} strokeWidth={1.7} />
              </span>
              <div>
                <p className="font-display text-[15px] font-semibold text-forest">{f.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chef's Favorites ─────────────────────────────────── */}
      <section className="container-x py-20">
        <SectionHeader
          script="Our Menu"
          title="Chef's Favorites"
          sub="The dishes our regulars refuse to let us take off the menu."
        />
        {loadingFeatured ? (
          <Loader label="Preparing chef's favorites…" />
        ) : (
          <>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
            <Reveal className="mt-14 text-center">
              <Link to="/menu" className="btn-forest">View Full Menu <ArrowRight size={16} /></Link>
            </Reveal>
          </>
        )}
      </section>

      {/* ── Browse by craving ────────────────────────────────── */}
      <section className="border-y border-sand bg-white py-16">
        <div className="container-x">
          <SectionHeader script="What are you craving" title="Browse by Craving" />
          {loadingCategories ? (
            <Loader label="Fetching categories…" />
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((c, i) => (
                <Reveal key={c._id} delay={i * 0.06}>
                  <Link to={`/menu?category=${c._id}`} className="group flex flex-col items-center gap-3 text-center">
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      className="h-24 w-24 rounded-full object-cover ring-1 ring-sand transition-all duration-500 group-hover:ring-4 group-hover:ring-sage"
                    />
                    <div>
                      <p className="font-display text-sm font-semibold text-forest">{c.name}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted">{c.tagline}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Reserve a table ──────────────────────────────────── */}
      <section id="reserve" className="container-x py-20">
        <Reveal>
          <div className="grid overflow-hidden rounded-[28px] bg-forest text-cream shadow-lift lg:grid-cols-2">
            <div className="relative min-h-[260px] lg:min-h-[380px]">
              <img src={RESERVE_IMG} alt="Inside the Scarcy dining room" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-forest/25" />
            </div>
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="kicker text-sage">Reserve Your Table</p>
              <h3 className="h-display-light mt-3 text-3xl sm:text-[38px]">Good Food Deserves a Great Table</h3>
              <p className="mt-4 max-w-md leading-relaxed text-cream/70">
                Book your table and enjoy a memorable dining experience with us. Whether it's a family
                dinner or a celebration — we'll have the table ready.
              </p>
              <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm text-cream/85">
                <li className="flex items-center gap-2"><Check size={15} className="text-sage" /> Cozy Seating</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-sage" /> Outdoor Terrace</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-sage" /> Group Bookings</li>
              </ul>
              <a href="tel:0421119247" className="btn-sage mt-9"><PhoneCall size={15} /> Reserve Your Table</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="border-y border-sand bg-white">
        <div className="container-x grid grid-cols-2 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center border-sand text-center lg:border-r lg:last:border-r-0">
              <s.icon className="text-forestsoft" size={21} strokeWidth={1.7} />
              <p className="mt-3 font-display text-3xl font-bold text-forest">{s.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
