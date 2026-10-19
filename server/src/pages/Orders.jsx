import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ReceiptText } from 'lucide-react';
import api from '../api/axios';
import Page from '../components/Page';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import Reveal from '../components/Reveal';

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get('/api/orders/mine').then(({ data }) => setOrders(data)).catch(() => setOrders([]));
  }, []);

  return (
    <Page className="container-x py-12">
      <p className="eyebrow text-center">Your history</p>
      <h1 className="h-display mt-1 text-center text-4xl">My Orders</h1>

      {!orders ? (
        <Loader label="Fetching your orders…" />
      ) : orders.length === 0 ? (
        <div className="mx-auto mt-16 max-w-sm text-center">
          <ReceiptText size={40} className="mx-auto text-muted/40" />
          <p className="mt-4 text-muted">No orders yet — your first feast is one tap away.</p>
          <Link to="/menu" className="btn-gold mt-6">Order something</Link>
        </div>
      ) : (
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {orders.map((o, i) => (
            <Reveal key={o._id} delay={i * 0.05}>
              <Link
                to={`/order/${o._id}`}
                className="card group flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40"
              >
                <div className="flex -space-x-3">
                  {o.items.slice(0, 3).map((it, idx) => (
                    <img key={idx} src={it.image} alt="" className="h-11 w-11 rounded-full border-2 border-coal object-cover" />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {o.items.map((it) => it.name).join(', ')}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {new Date(o.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })} · Rs {o.totalPrice.toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={o.status} />
                <ChevronRight size={18} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" />
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </Page>
  );
}
