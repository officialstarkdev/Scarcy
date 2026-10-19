import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ReceiptText, LogIn } from 'lucide-react';
import api from '../api/axios';
import Page from '../components/Page';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import Reveal from '../components/Reveal';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get('/api/orders/mine').then(({ data }) => setOrders(data)).catch(() => setOrders([]));
  }, [user]);

  return (
    <Page className="container-x py-12">
      <p className="text-center font-display text-lg italic text-forestsoft">Your history</p>
      <h1 className="h-display mt-2 text-center text-4xl">My Orders</h1>

      {!user ? (
        <div className="mx-auto mt-14 max-w-md text-center card p-8 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-creamdeep text-forest">
            <ReceiptText size={32} />
          </div>
          <h2 className="font-display text-2xl font-bold text-forest mt-4">Sign in to view your orders</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Track your ongoing deliveries, review order receipts, and easily reorder your favourite dishes from Scarcy.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" state={{ from: '/orders' }} className="btn-forest w-full sm:w-auto">
              <LogIn size={15} /> Sign in
            </Link>
            <Link to="/register" state={{ from: '/orders' }} className="btn-outline w-full sm:w-auto">
              Create account
            </Link>
          </div>
        </div>
      ) : !orders ? (
        <Loader label="Fetching your orders…" />
      ) : orders.length === 0 ? (
        <div className="mx-auto mt-16 max-w-sm text-center">
          <ReceiptText size={40} className="mx-auto text-forest/20" />
          <p className="mt-4 text-muted">No orders yet — your first feast is one tap away.</p>
          <Link to="/menu" className="btn-forest mt-6">Order something</Link>
        </div>
      ) : (
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {orders.map((o, i) => (
            <Reveal key={o._id} delay={i * 0.05}>
              <Link
                to={`/order/${o._id}`}
                className="card group flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/30"
              >
                <div className="flex -space-x-3">
                  {o.items.slice(0, 3).map((it, idx) => (
                    <img key={idx} src={it.image} alt="" className="h-11 w-11 rounded-xl border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-medium text-forest">
                    {o.items.map((it) => it.name).join(', ')}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {new Date(o.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })} · <span className="font-price font-semibold text-forest">Rs {o.totalPrice.toLocaleString()}</span>
                  </p>
                </div>
                <StatusBadge status={o.status} />
                <ChevronRight size={18} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-forest" />
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </Page>
  );
}
