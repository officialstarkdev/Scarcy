import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Flame, Leaf, Plus, Star, Sparkles, ChefHat } from 'lucide-react';
import { useCart } from '../context/CartContext';

const TAG_ICONS = {
  spicy: { icon: Flame, cls: 'text-ember', title: 'Spicy' },
  veg: { icon: Leaf, cls: 'text-leaf', title: 'Vegetarian' },
  new: { icon: Sparkles, cls: 'text-sky-600', title: 'New' },
  'chef-special': { icon: ChefHat, cls: 'text-forestsoft', title: "Chef's special" },
};

/* Small round tag bullets shown over the photo */
function TagDots({ tags = [] }) {
  const shown = tags.filter((t) => TAG_ICONS[t]);
  if (!shown.length) return null;
  return (
    <div className="absolute right-3 top-3 flex flex-col gap-1.5">
      {shown.slice(0, 3).map((t) => {
        const T = TAG_ICONS[t];
        return (
          <span
            key={t}
            title={T.title}
            aria-label={T.title}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur"
          >
            <T.icon size={13} className={T.cls} />
          </span>
        );
      })}
    </div>
  );
}

function SoldOut() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream/75 backdrop-blur-[2px]">
      <span className="rounded-full border border-forest/25 bg-white/80 px-4 py-1.5 text-xs font-medium text-forest">
        Sold out today
      </span>
    </div>
  );
}

export default function ProductCard({ product, index = 0, variant = 'grid' }) {
  const { add } = useCart();
  const bestseller = product.tags?.includes('bestseller');

  if (variant === 'row') {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.45, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="group relative flex items-center gap-4 rounded-2xl border border-sand bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
      >
        <Link to={`/dish/${product._id}`} className="relative shrink-0" aria-label={`View ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-16 w-16 rounded-xl object-cover sm:h-[70px] sm:w-[70px]"
          />
          {!product.isAvailable && <SoldOut />}
        </Link>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[15px] font-semibold text-forest">
            <Link to={`/dish/${product._id}`} className="transition-colors hover:text-forestsoft">{product.name}</Link>
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted sm:line-clamp-1">{product.description}</p>
        </div>

        <span className="mx-1 hidden h-px flex-1 border-b border-dotted border-sand lg:block" aria-hidden />

        <div className="flex shrink-0 items-center gap-3">
          <span className="font-price text-[15px] font-bold text-forest">Rs {product.price.toLocaleString()}</span>
          <button
            onClick={() => add(product)}
            disabled={!product.isAvailable}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/25 text-forest transition hover:bg-forest hover:text-cream disabled:pointer-events-none disabled:opacity-40"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={15} />
          </button>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-creamdeep">
        <Link to={`/dish/${product._id}`} aria-label={`View ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </Link>
        {bestseller && (
          <span className="absolute left-3 top-3 rounded-full bg-forest px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sage">
            Bestseller
          </span>
        )}
        <TagDots tags={product.tags} />
        {!product.isAvailable && <SoldOut />}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[19px] font-semibold leading-snug text-forest">
          <Link to={`/dish/${product._id}`} className="transition-colors hover:text-forestsoft">{product.name}</Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted">{product.description}</p>

        <div className="mt-3.5 flex items-center gap-3 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {product.prepTime} min</span>
          <span className="inline-flex items-center gap-1 text-gold">
            <Star size={12} fill="currentColor" /> {product.rating?.toFixed(1) || '0.0'}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-sand pt-4">
          <span className="font-price text-lg font-bold text-forest">Rs {product.price.toLocaleString()}</span>
          <button
            onClick={() => add(product)}
            disabled={!product.isAvailable}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-2 text-xs font-medium text-cream transition hover:bg-forestsoft active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
