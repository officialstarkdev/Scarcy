import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MapPin, Phone } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

const STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const LABELS = {
  all: 'All', pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'On the way', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const load = () => api.get(`/api/orders?status=${filter}`).then(({ data }) => setOrders(data)).catch(() => setOrders([]));
  useEffect(() => { setOrders(null); load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/api/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...data } : o)));
      toast.success(`Order moved to "${LABELS[status]}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update the order');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs transition-all ${
              filter === s ? 'bg-gold text-ink font-medium' : 'border border-white/10 text-cream/70 hover:border-gold/50'
            }`}
          >
            {LABELS[s]}
          </button>
        ))}
      </div>

      {!orders ? (
        <Loader label="Loading orders…" />
      ) : orders.length === 0 ? (
        <p className="py-16 text-center text-muted">No orders in this bucket.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === o._id ? null : o._id)}
                className="flex w-full flex-wrap items-center gap-3 p-4 text-left"
                aria-expanded={open === o._id}
              >
                <span className="font-mono text-xs text-muted">#{o._id.slice(-6).toUpperCase()}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{o.user?.name} — {o.items.map((i) => i.name).join(', ')}</span>
                <span className="text-sm text-goldlight">Rs {o.totalPrice.toLocaleString()}</span>
                <StatusBadge status={o.status} />
                <ChevronDown size={16} className={`text-muted transition-transform ${open === o._id ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {open === o._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-white/5"
                  >
                    <div className="grid gap-5 p-5 sm:grid-cols-2">
                      <div className="text-sm">
                        <p className="mb-2 font-medium text-cream/90">Items</p>
                        <ul className="space-y-1.5 text-muted">
                          {o.items.map((i, idx) => (
                            <li key={idx} className="flex justify-between gap-3">
                              <span>{i.name} × {i.qty}</span><span>Rs {(i.price * i.qty).toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-xs text-muted">
                          {o.paymentMethod === 'cod' ? 'Cash on delivery' : 'Card'} · {o.isPaid ? 'Paid' : 'Unpaid'} ·{' '}
                          {new Date(o.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="mb-2 font-medium text-cream/90">Deliver to</p>
                        <p className="flex items-start gap-2 text-muted"><MapPin size={15} className="mt-0.5 shrink-0 text-gold" />{o.address.street}, {o.address.area}, {o.address.city}</p>
                        <p className="mt-1.5 flex items-center gap-2 text-muted"><Phone size={15} className="shrink-0 text-gold" />{o.address.phone}</p>
                        {o.address.note && <p className="mt-2 rounded-lg bg-slate2/60 p-2.5 text-xs text-muted">"{o.address.note}"</p>}

                        <label className="label mt-4" htmlFor={`status-${o._id}`}>Update status</label>
                        <select
                          id={`status-${o._id}`}
                          value={o.status}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          className="input"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
