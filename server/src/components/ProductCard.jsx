import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Flame, Leaf, Plus, Star, Sparkles, ChefHat } from 'lucide-react';
import { useCart } from '../context/CartContext';

const TAG_ICONS = {
  spicy: { icon: Flame, cls: 'text-ember', title: 'Spicy' },
  veg: { icon: Leaf, cls: 'text-leaf', title: 'Vegetarian' },
  new: { icon: Sparkles, cls: 'text-sky-400', title: 'New' },
  'chef-special': { icon: ChefHat, cls: 'text-gold', title: "Chef's special" },
};

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="card group relative flex flex-col items-center px-5 pb-6 pt-16 text-center"
    >
      {product.tags?.includes('bestseller') && (
        <span className="absolute left-4 top-4 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink">
          Bestseller
        </span>
      )}

      {/* plated image — lifts and turns like a plate being presented */}
      <Link to={`/dish/${product._id}`} className="relative -mt-28 mb-4 block h-36 w-36 sm:h-40 sm:w-40" aria-label={`View ${product.name}`}>
        <div className="absolute inset-0 rounded-full bg-gold/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="relative h-full w-full rounded-full border-2 border-gold/25 object-cover shadow-card
          transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-6 group-hover:border-gold/70"
        />
      </Link>

      <h3 className="h-display text-xl">
        <Link to={`/dish/${product._id}`} className="transition-colors hover:text-goldlight">{product.name}</Link>
      </h3>
      <p className="mt-0.5 font-script text-xl text-gold/80">Zaiqa's kitchen</p>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{product.description}</p>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><Clock size={13} /> {product.prepTime} min</span>
        <span className="inline-flex items-center gap-1 text-gold"><Star size={13} fill="currentColor" /> {product.rating?.toFixed(1)}</span>
        {product.tags?.filter((t) => TAG_ICONS[t]).map((t) => {
          const T = TAG_ICONS[t];
          return <T.icon key={t} size={14} className={T.cls} title={T.title} aria-label={T.title} />;
        })}
      </div>

      <div className="mt-5 flex w-full items-center justify-between border-t border-white/5 pt-4">
        <p className="font-display text-lg font-bold text-goldlight">Rs {product.price.toLocaleString()}</p>
        <button
          onClick={() => add(product)}
          disabled={!product.isAvailable}
          className="btn-gold !px-4 !py-2 text-sm"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {!product.isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ink/70 backdrop-blur-[2px]">
          <span className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-muted">Sold out today</span>
        </div>
      )}
    </motion.article>
  );
}
