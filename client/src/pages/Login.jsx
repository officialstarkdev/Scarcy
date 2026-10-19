import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Page from '../components/Page';

const SIDE_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}`);
      navigate(location.state?.from || (u.isAdmin ? '/admin' : '/'), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not sign in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page className="container-x flex min-h-[72vh] items-center justify-center py-14">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-sand bg-white shadow-lift lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between bg-forest p-10 text-cream lg:flex">
          <img src={SIDE_IMG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="relative">
            <span className="font-display text-3xl font-bold">Scarcy</span>
            <p className="mt-8 font-display text-2xl italic text-sage">Savor the Extraordinary</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              Sign in to track your orders, reorder favourites and rate the dishes you love.
            </p>
          </div>
          <p className="relative text-xs text-cream/50">14-B MM Alam Road, Gulberg III, Lahore</p>
        </aside>

        <div className="p-8 sm:p-10">
          <p className="kicker">Welcome back</p>
          <h1 className="h-display mt-2 text-3xl">Sign in to your table</h1>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" required className="input" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" type="password" required className="input" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="btn-forest w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>

          <p className="mt-6 text-sm text-muted">
            New to Scarcy? <Link to="/register" className="font-medium text-forest underline underline-offset-4">Create an account</Link>
          </p>

          <div className="mt-6 rounded-2xl border border-sand bg-creamdeep/70 p-4 text-xs text-muted">
            <p className="font-medium uppercase tracking-wider text-forest">Demo accounts</p>
            <p className="mt-1.5">Admin — admin@zaiqa.com / admin123</p>
            <p>Customer — user@zaiqa.com / user123</p>
          </div>
        </div>
      </div>
    </Page>
  );
}
