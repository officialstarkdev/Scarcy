import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Wheat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Page from '../components/Page';

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
    <Page className="container-x flex min-h-[75vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <div className="text-center">
          <Wheat className="mx-auto text-gold" size={30} strokeWidth={1.5} />
          <h1 className="h-display mt-3 text-3xl">Welcome back</h1>
          <p className="mt-1 font-script text-2xl text-gold/80">the table is set</p>
        </div>
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
          <button className="btn-gold w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          New to Zaiqa? <Link to="/register" className="text-gold hover:underline">Create an account</Link>
        </p>
        <div className="mt-6 rounded-xl border border-white/5 bg-slate2/60 p-4 text-xs text-muted">
          <p className="font-medium text-cream/80">Demo accounts</p>
          <p className="mt-1">Admin — admin@zaiqa.com / admin123</p>
          <p>Customer — user@zaiqa.com / user123</p>
        </div>
      </div>
    </Page>
  );
}
