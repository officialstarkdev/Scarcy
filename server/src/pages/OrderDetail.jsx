import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, ChefHat, CircleDollarSign, Home, MapPin, Package, Phone, Truck } from 'lucide-react';
import api from '../api/axios';
import Page from '../components/Page';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';

const STEPS = [
  { key: 'pending', label: 'Order placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'preparing', label: 'In the kitchen', icon: ChefHat },
  { key: 'out_for_delivery', label: 'On the way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

export default function OrderDetail() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const verified = useRef(false);

  const load = () => api.get(`/api/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => {});

  useEffect(() => {
    const sessionId = params.get('session_id');
    if (sessionId && !verified.current) {
      verified.current = true;
      api
        .get(`/api/payment/verify/${sessionId}`)
        .then(({ data }) => {
          if (data.isPaid) toast.success('Payment received — order confirmed!');
          params.delete('session_id');
          setParams(params, { replace: true });
        })
        .catch(() => {})
        .finally(load);
    } else {
      if (params.get('payment') === 'cancelled') toast('Payment cancelled — you can retry or switch to cash.', { icon: 'ℹ️' });
      load();
    }
    const t = setInterval(load, 15000); // gentle live tracking
    return () => clearInterval(t);
  }, [id]);

  if (!order) return <Page className="container-x py-12"><Loader label="Finding your order…" /></Page>;

  const cancelled = order.status === 'cancelled';
  const activeIdx = STEPS.findIndex((s) => s.key === order.status);

  return (
    <Page className="container-x py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Order ticket</p>
            <h1 className="h-display text-3xl">#{order._id.slice(-6).toUpperCase()}</h1>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* kitchen-ticket tracker */}
        {!cancelled && (
          <div className="card mt-8 p-6 sm:p-8">
            <div className="relative flex justify-between">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-white/10" />
              <motion.div
                className="absolute left-0 top-5 h-0.5 bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${(Math.max(activeIdx, 0) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              {STEPS.map((s, i) => {
                const done = i <= activeIdx;
                const current = i === activeIdx;
                return (
                  <div key={s.key} className="relative z-10 flex w-16 flex-col items-center text-center sm:w-20">
                    <motion.span
                      animate={current ? { scale: [1, 1.12, 1] } : {}}
                      transition={current ? { repeat: Infinity, duration: 1.8 } : {}}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-500 ${
                        done ? 'border-gold bg-gold text-ink' : 'border-white/15 bg-coal text-muted'
                      }`}
                    >
                      <s.icon size={17} />
                    </motion.span>
                    <span className={`mt-2 text-[11px] leading-tight sm:text-xs ${done ? 'text-cream' : 'text-muted'}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
            {order.status === 'out_for_delivery' && (
              <p className="mt-6 text-center text-sm text-muted">Your rider is on the road — keep your phone close.</p>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold">Items</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <img src={i.image} alt="" className="h-10 w-10 rounded-full border border-gold/20 object-cover" />
                  <span className="flex-1">{i.name} <span className="text-muted">× {i.qty}</span></span>
                  <span>Rs {(i.price * i.qty).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-white/5 pt-3 text-sm">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span>Rs {order.itemsPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-muted"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : `Rs ${order.deliveryFee}`}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-leaf"><span>Promo{order.promoCode ? ` (${order.promoCode})` : ''}</span><span>− Rs {order.discount.toLocaleString()}</span></div>
              )}
              <div className="flex justify-between pt-1 font-display font-bold"><span>Total</span><span className="text-goldlight">Rs {order.totalPrice.toLocaleString()}</span></div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold">Delivery & payment</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                {order.address.street}, {order.address.area}, {order.address.city}
              </li>
              <li className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-gold" /> {order.address.phone}</li>
              <li className="flex items-center gap-2">
                <CircleDollarSign size={16} className="shrink-0 text-gold" />
                {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Card'} ·{' '}
                <span className={order.isPaid ? 'text-leaf' : 'text-yellow-400'}>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
              </li>
              {order.address.note && <li className="rounded-lg bg-slate2/60 p-3 text-xs">"{order.address.note}"</li>}
            </ul>
          </section>
        </div>
      </div>
    </Page>
  );
}
