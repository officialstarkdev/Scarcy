import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BikeIcon, Clock, Flame, Star, UtensilsCrossed, PhoneCall } from 'lucide-react';
import api from '../api/axios';
import Page from '../components/Page';
import Reveal from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const HERO_IMG = 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=80';

const testimonials = [
  { name: 'Hira S.', text: 'The chicken karahi tastes like it came off Fort Road. Arrived hot, packed beautifully.', stars: 5 },
  { name: 'Usman K.', text: 'Ordered the BBQ platter for a family dinner — the seekh kebabs disappeared in minutes.', stars: 5 },
  { name: 'Mahnoor A.', text: 'Live order tracking is a small thing that makes a big difference. Zaiqa nails it.', stars: 4 },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    api.get('/api/categories').then(({ data }) => setCategories(data)).catch(() => {});
    api.get('/api/products?featured=true').then(({ data }) => setFeatured(data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <Page>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="container-x grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            Taste of Lahore
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="h-display mt-2 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl"
          >
            Fire, flour &<br />
            <span className="text-gold">a full heart.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-md text-muted"
          >
            Slow-cooked handi, charcoal BBQ, honest fast food — made to order and delivered hot to your door in under 45 minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link to="/menu" className="btn-gold">Order now <ArrowRight size={17} /></Link>
            <a href="tel:0421119247" className="btn-ghost"><PhoneCall size={16} /> 042-111-924-72</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted"
          >
            <span className="flex items-center gap-2"><Clock size={15} className="text-gold" /> 45 min average delivery</span>
            <span className="flex items-center gap-2"><Star size={15} className="text-gold" fill="currentColor" /> 4.8 from 2,400+ reviews</span>
            <span className="flex items-center gap-2"><Flame size={15} className="text-ember" /> Live charcoal grill</span>
          </motion.div>
        </div>

        {/* plated hero dish on a slow-turning gold ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-0 animate-spinslow rounded-full border border-dashed border-gold/30" />
          <div className="absolute inset-6 rounded-full bg-gold/10 blur-3xl" />
          <img
            src={HERO_IMG}
            alt="Chicken karahi, Zaiqa's signature dish"
            className="absolute inset-8 h-[calc(100%-4rem)] w-[calc(100%-4rem)] animate-floaty rounded-full border-4 border-gold/40 object-cover shadow-gold"
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="card absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 px-5 py-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold"><UtensilsCrossed size={17} /></span>
            <div className="text-left">
              <p className="text-sm font-semibold leading-none">Chicken Karahi</p>
              <p className="mt-1 text-xs text-muted">Today's most ordered</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="container-x py-14">
        <SectionHeader script="What are you craving" title="Browse by Category" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Reveal key={c._id} delay={i * 0.06}>
              <Link
                to={`/menu?category=${c._id}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-coal p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-gold"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-20 w-20 rounded-full border border-gold/20 object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
                />
                <div>
                  <p className="font-display font-semibold">{c.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{c.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Featured dishes ──────────────────────────────── */}
      <section className="container-x py-16">
        <SectionHeader
          script="From our kitchen"
          title="Chef's Signatures"
          sub="The dishes our regulars refuse to let us take off the menu."
        />
        <div className="mt-24 grid gap-x-6 gap-y-28 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
        <Reveal className="mt-14 text-center">
          <Link to="/menu" className="btn-ghost">See the full menu <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      {/* ── Deal banner ──────────────────────────────────── */}
      <section className="container-x py-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-r from-coal via-slate2 to-coal px-8 py-12 text-center sm:px-14">
            <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-gold/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-ember/10 blur-3xl" />
            <p className="eyebrow">This week only</p>
            <h3 className="h-display mt-1 text-3xl sm:text-4xl">Free delivery over Rs 2,500</h3>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Feeding the whole family? We'll bring it to your gate on the house — every order, every night.
            </p>
            <Link to="/menu" className="btn-gold mt-6">Build your feast</Link>
          </div>
        </Reveal>
      </section>

      {/* ── Why Zaiqa ────────────────────────────────────── */}
      <section className="container-x py-16">
        <SectionHeader script="The Zaiqa promise" title="Why People Keep Coming Back" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Flame, title: 'Cooked on real coal', text: 'Our BBQ never touches a gas flame. Charcoal, smoke and patience — the old way.' },
            { icon: BikeIcon, title: 'Hot in 45 minutes', text: 'Insulated boxes, our own riders, and live tracking from tandoor to doorstep.' },
            { icon: Star, title: 'Fresh, every day', text: 'Masalas ground each morning, meat sourced daily. Nothing sits overnight.' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="card group h-full p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/40">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <f.icon size={24} strokeWidth={1.6} />
                </span>
                <h3 className="h-display mt-4 text-xl">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="container-x py-16">
        <SectionHeader script="Word of mouth" title="From Our Tables" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="card h-full p-7">
                <div className="flex gap-1 text-gold">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={15} fill={s < t.stars ? 'currentColor' : 'none'} className={s < t.stars ? '' : 'text-muted/40'} />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-cream/90">"{t.text}"</blockquote>
                <figcaption className="mt-4 font-script text-2xl text-gold/80">{t.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </Page>
  );
}
