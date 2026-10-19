import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, ChefHat, Clock, Flame, Leaf, Minus, Plus, Sparkles, Star, Users } from 'lucide-react';
import api from '../api/axios';
import Page from '../components/Page';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const TAG_META = {
  spicy: { icon: Flame, cls: 'text-ember border-ember/30 bg-ember/10', label: 'Spicy' },
  veg: { icon: Leaf, cls: 'text-leaf border-leaf/30 bg-leaf/10', label: 'Vegetarian' },
  new: { icon: Sparkles, cls: 'text-sky-700 border-sky-500/30 bg-sky-500/10', label: 'New' },
  'chef-special': { icon: ChefHat, cls: 'text-forestsoft border-forest/25 bg-forest/10', label: "Chef's special" },
  bestseller: { icon: Star, cls: 'text-gold border-gold/30 bg-gold/10', label: 'Bestseller' },
};

function Stars({ value, size = 15, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(value) ? 'text-gold' : 'text-sand'} fill="currentColor" />
      ))}
    </span>
  );
}

function ReviewForm({ productId, onDone }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Tap a star to rate the dish');
    setBusy(true);
    try {
      await api.post(`/api/products/${productId}/reviews`, { rating, comment });
      toast.success('Shukriya! Your review is live.');
      setRating(0); setComment('');
      onDone?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post the review');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card p-6 sm:p-7">
      <h3 className="font-display text-lg font-semibold text-forest">Rate this dish</h3>
      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-1 transition-transform duration-150 hover:scale-125 focus-visible:scale-125"
          >
            <Star
              size={26}
              className={`transition-colors ${n <= (hover || rating) ? 'text-gold' : 'text-sand'}`}
              fill="currentColor"
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted">
          {(hover || rating) ? ['', 'Not for me', 'It was okay', 'Good', 'Really good', 'Zaiqedaar!'][hover || rating] : ''}
        </span>
      </div>
      <textarea
        className="input mt-4 min-h-[90px]"
        placeholder="How was it? Spice level, portion, would you reorder…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className="btn-forest mt-4 !px-6 !py-2.5 !text-sm" disabled={busy}>
        {busy ? 'Posting…' : 'Post review'}
      </button>
    </form>
  );
}

export default function Dish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);

  const load = () => api.get(`/api/products/${id}`).then(({ data }) => setProduct(data)).catch(() => setError(true));
  useEffect(() => { setProduct(null); setError(false); setQty(1); load(); }, [id]); // eslint-disable-line

  if (error) {
    return (
      <Page className="container-x py-24 text-center">
        <h1 className="h-display text-3xl">This dish has left the menu</h1>
        <p className="mt-2 text-muted">It may have been retired by the kitchen.</p>
        <Link to="/menu" className="btn-forest mt-6 inline-flex">Back to the menu</Link>
      </Page>
    );
  }
  if (!product) return <Page className="container-x py-24"><Loader label="Plating up…" /></Page>;

  const reviews = [...(product.reviews || [])].reverse();
  const alreadyReviewed = user && product.reviews?.some((r) => r.user === user._id);

  const addToCart = () => {
    for (let i = 0; i < qty; i++) add(product);
  };

  return (
    <Page className="container-x py-10 sm:py-14">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-forest">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mt-8 grid items-start gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-sand bg-white p-3 shadow-soft"
        >
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/3] w-full rounded-[20px] object-cover"
          />
          {!product.isAvailable && (
            <div className="absolute inset-3 flex items-center justify-center rounded-[20px] bg-cream/75 backdrop-blur-[2px]">
              <span className="rounded-full border border-forest/25 bg-white/80 px-4 py-1.5 text-sm text-forest">Sold out today</span>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="eyebrow">{product.category?.name || 'From the kitchen'}</p>
          <h1 className="h-display mt-3 text-4xl sm:text-5xl">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <Stars value={product.rating || 0} />
            <span className="font-medium text-forest">{(product.rating || 0).toFixed(1)}</span>
            <span className="text-muted">· {product.numReviews || 0} review{product.numReviews === 1 ? '' : 's'}</span>
          </div>

          <p className="mt-5 max-w-prose leading-relaxed text-muted">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3 py-1.5 text-xs text-muted">
              <Clock size={13} className="text-forestsoft" /> {product.prepTime} min
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3 py-1.5 text-xs text-muted">
              <Users size={13} className="text-forestsoft" /> Serves {product.serves}
            </span>
            {product.tags?.filter((t) => TAG_META[t]).map((t) => {
              const T = TAG_META[t];
              return (
                <span key={t} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${T.cls}`}>
                  <T.icon size={13} /> {T.label}
                </span>
              );
            })}
          </div>

          <div className="divider-leaf my-8" />

          <div className="flex flex-wrap items-center gap-5">
            <p className="font-price text-3xl font-bold text-forest">Rs {product.price.toLocaleString()}</p>
            <div className="flex items-center gap-1 rounded-full border border-sand bg-white p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="rounded-full p-2 text-muted transition hover:bg-creamdeep hover:text-forest"><Minus size={15} /></button>
              <span className="w-8 text-center font-medium" aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity" className="rounded-full p-2 text-muted transition hover:bg-creamdeep hover:text-forest"><Plus size={15} /></button>
            </div>
            <button onClick={addToCart} disabled={!product.isAvailable} className="btn-forest">
              <Plus size={17} /> Add {qty > 1 ? `${qty} ` : ''}to cart
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">
            <span className="font-price font-semibold text-forest">Rs {(product.price * qty).toLocaleString()}</span> total · free delivery over <span className="font-price font-semibold text-forest">Rs 2,500</span>
          </p>
        </motion.div>
      </div>

      {/* reviews */}
      <section className="mx-auto mt-20 max-w-3xl">
        <p className="text-center font-display text-lg italic text-forestsoft">Word of mouth</p>
        <h2 className="h-display mt-2 text-center text-3xl">Reviews</h2>
        <div className="divider-leaf mx-auto mt-4 max-w-[180px]" />

        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="font-display text-5xl font-bold text-forest">{(product.rating || 0).toFixed(1)}</span>
          <div>
            <Stars value={product.rating || 0} size={18} />
            <p className="mt-1 text-xs text-muted">{product.numReviews || 0} review{product.numReviews === 1 ? '' : 's'} so far</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {reviews.length === 0 && (
            <p className="text-center text-sm text-muted">No reviews yet — be the first to tell us how it tasted.</p>
          )}
          {reviews.map((r) => (
            <motion.article
              key={r._id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="card p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 font-display font-semibold text-forest">
                  {r.name?.[0]?.toUpperCase() || '?'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-forest">{r.name}</p>
                  <p className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <Stars value={r.rating} size={13} />
              </div>
              {r.comment && <p className="mt-3 text-sm leading-relaxed text-muted">{r.comment}</p>}
            </motion.article>
          ))}
        </div>

        <div className="mt-8">
          {!user ? (
            <p className="card p-6 text-center text-sm text-muted">
              <Link to="/login" className="font-medium text-forest underline underline-offset-4">Sign in</Link> to rate this dish.
            </p>
          ) : alreadyReviewed ? (
            <p className="card p-6 text-center text-sm text-muted">You've already reviewed this dish — shukriya!</p>
          ) : (
            <ReviewForm productId={product._id} onDone={load} />
          )}
        </div>
      </section>
    </Page>
  );
}
