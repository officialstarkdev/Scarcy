import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircleDollarSign, Flame, ReceiptText, Users, UtensilsCrossed } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/api/admin/stats').then(({ data }) => setStats(data)).catch(() => {});
    api.get('/api/orders').then(({ data }) => setRecent(data.slice(0, 6))).catch(() => {});
  }, []);

  if (!stats) return <Loader label="Counting the till…" />;

  const cards = [
    { icon: CircleDollarSign, label: 'Revenue (delivered)', value: `Rs ${stats.revenue.toLocaleString()}` },
    { icon: ReceiptText, label: 'Total orders', value: stats.totalOrders },
    { icon: Flame, label: 'Active right now', value: stats.activeOrders },
    { icon: UtensilsCrossed, label: 'Dishes on menu', value: stats.products },
    { icon: Users, label: 'Customers', value: stats.customers },
  ];

  const max = Math.max(...stats.daily.map((d) => d.revenue), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card p-5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest">
              <c.icon size={18} />
            </span>
            <p className="mt-3 font-display text-2xl font-bold text-forest">{c.value}</p>
            <p className="mt-0.5 text-xs text-muted">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 7-day revenue bars */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-forest">Last 7 days</h2>
        <div className="mt-6 flex h-40 items-end gap-3">
          {stats.daily.map((d, i) => (
            <div key={i} className="group flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
                Rs {d.revenue.toLocaleString()}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((d.revenue / max) * 100, 3)}%` }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeOut' }}
                className="w-full max-w-[46px] rounded-t-lg bg-gradient-to-t from-forest/60 to-forest transition group-hover:from-forestsoft group-hover:to-forestsoft"
              />
              <span className="text-xs text-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-forest">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-forest underline underline-offset-4">Manage all</Link>
        </div>
        <ul className="mt-4 divide-y divide-sand text-sm">
          {recent.map((o) => (
            <li key={o._id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="font-mono text-xs text-muted">#{o._id.slice(-6).toUpperCase()}</span>
              <span className="flex-1 truncate text-ink">{o.user?.name} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</span>
              <span className="font-price font-semibold text-forest">Rs {o.totalPrice.toLocaleString()}</span>
              <StatusBadge status={o.status} />
            </li>
          ))}
          {recent.length === 0 && <li className="py-6 text-center text-muted">No orders yet.</li>}
        </ul>
      </div>
    </div>
  );
}
