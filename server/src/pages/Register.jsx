import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Wheat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Page from '../components/Page';

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
      toast.success('Account created — welcome to Zaiqa');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create account');
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <Page className="container-x flex min-h-[75vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <div className="text-center">
          <Wheat className="mx-auto text-gold" size={30} strokeWidth={1.5} />
          <h1 className="h-display mt-3 text-3xl">Join the table</h1>
          <p className="mt-1 font-script text-2xl text-gold/80">good food awaits</p>
        </div>
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
          <button className="btn-gold w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Already with us? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </Page>
  );
}
