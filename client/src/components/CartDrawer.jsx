import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, remove, subtotal, deliveryFee, total, FREE_ABOVE } = useCart();
  const navigate = useNavigate();
  const remaining = FREE_ABOVE - subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-forestdeep/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-sand bg-cream"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-sand bg-white px-6 py-5">
              <h2 className="font-display text-xl font-bold text-forest">Your order</h2>
              <button onClick={() => setIsOpen(false)} aria-label="Close cart" className="rounded-full p-2 text-muted transition hover:bg-creamdeep hover:text-forest">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag size={44} className="text-forest/20" />
                <p className="text-muted">Your cart is empty — the kitchen is waiting.</p>
                <Link to="/menu" onClick={() => setIsOpen(false)} className="btn-forest">Browse the menu</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.div
                        key={i._id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                        className="flex gap-4 border-b border-sand pb-4 last:border-0"
                      >
                        <img src={i.image} alt={i.name} className="h-16 w-16 rounded-xl object-cover" />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display font-semibold leading-tight text-forest">{i.name}</p>
                            <button onClick={() => remove(i._id)} aria-label={`Remove ${i.name}`} className="text-muted transition hover:text-ember">
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="font-price text-sm font-semibold text-forest">Rs {i.price.toLocaleString()}</p>
                          <div className="mt-2 flex w-fit items-center gap-3 rounded-full border border-sand bg-white px-2 py-1">
                            <button onClick={() => updateQty(i._id, i.qty - 1)} aria-label="Decrease quantity" className="p-0.5 text-muted transition hover:text-forest"><Minus size={14} /></button>
                            <span className="w-4 text-center text-sm font-medium">{i.qty}</span>
                            <button onClick={() => updateQty(i._id, i.qty + 1)} aria-label="Increase quantity" className="p-0.5 text-muted transition hover:text-forest"><Plus size={14} /></button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-sand bg-white px-6 py-5">
                  {remaining > 0 ? (
                    <p className="mb-3 flex items-center gap-2 text-xs text-muted">
                      <Truck size={14} className="text-forestsoft" />
                      Add <span className="font-price font-semibold text-forest">Rs {remaining.toLocaleString()}</span> more for free delivery
                    </p>
                  ) : (
                    <p className="mb-3 flex items-center gap-2 text-xs text-leaf">
                      <Truck size={14} /> Delivery is on the house
                    </p>
                  )}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted"><span>Subtotal</span><span className="font-price font-medium">Rs {subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-muted"><span>Delivery</span><span className="font-price font-medium">{deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee}`}</span></div>
                    <div className="flex justify-between border-t border-sand pt-2 text-lg font-bold text-forest">
                      <span>Total</span><span className="font-price">Rs {total.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); navigate('/checkout'); }}
                    className="btn-forest mt-4 w-full"
                  >
                    Go to checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
