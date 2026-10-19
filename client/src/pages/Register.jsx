import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Page from '../components/Page';

const SIDE_IMG = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password needs at least 6 characters');
    setBusy(true);
    try {
      await register(form);
      toast.success('Account created — welcome to Scarcy');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create account');
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <Page className="container-x flex min-h-[72vh] items-center justify-center py-14">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-sand bg-white shadow-lift lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between bg-forest p-10 text-cream lg:flex">
          <img src={SIDE_IMG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="relative">
            <span className="font-display text-3xl font-bold">Scarcy</span>
            <p className="mt-8 font-display text-2xl italic text-sage">Savor the extraordinary</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              Join the table for faster checkout, live order tracking and a spot in our loyalty list.
            </p>
          </div>
          <p className="relative text-xs text-cream/50">Delivering hot across Lahore</p>
        </aside>

        <div className="p-8 sm:p-10">
          <p className="kicker">Join the table</p>
          <h1 className="h-display mt-2 text-3xl">Create your account</h1>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="name">Full name</label>
              <input id="name" required className="input" placeholder="Ali Raza" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="label" htmlFor="remail">Email</label>
              <input id="remail" type="email" required className="input" placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" required className="input" placeholder="03xx-xxxxxxx" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="label" htmlFor="rpassword">Password</label>
              <input id="rpassword" type="password" required minLength={6} className="input" placeholder="At least 6 characters" value={form.password} onChange={set('password')} />
            </div>
            <button className="btn-forest w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
          </form>

          <p className="mt-6 text-sm text-muted">
            Already with us? <Link to="/login" className="font-medium text-forest underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </div>
    </Page>
  );
}
