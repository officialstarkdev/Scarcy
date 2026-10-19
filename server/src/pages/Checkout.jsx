import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Banknote, CreditCard, MapPin, TicketPercent, X } from 'lucide-react';
import api from '../api/axios';
import Page from '../components/Page';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { items, subtotal, deliveryFee, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', area: '', city: 'Lahore', phone: user?.phone || '', note: '' });
  const [payment, setPayment] = useState('cod');
  const [busy, setBusy] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null); // { code, discount }
  const [checking, setChecking] = useState(false);

  const discount = promo ? Math.min(promo.discount, subtotal) : 0;
  const grandTotal = subtotal + deliveryFee - discount;

  const applyPromo = async () => {
    if (!promoInput.trim()) return toast.error('Type a promo code first');
    setChecking(true);
    try {
      const { data } = await api.post('/api/promos/validate', { code: promoInput, subtotal });
      setPromo(data);
      toast.success(`${data.code} applied — Rs ${data.discount.toLocaleString()} off!`);
    } catch (err) {
      setPromo(null);
      toast.error(err.response?.data?.message || 'That code did not work');
    } finally {
      setChecking(false);
    }
  };

  // if the cart changes while a promo is applied, silently re-validate it
  useEffect(() => {
    if (!promo) return;
    api.post('/api/promos/validate', { code: promo.code, subtotal })
      .then(({ data }) => setPromo(data))
      .catch(() => { setPromo(null); toast('Promo removed — cart no longer qualifies', { icon: '🎟️' }); });
  }, [subtotal]); // eslint-disable-line

  const set = (k) => (e) => setAddress({ ...address, [k]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty');
    setBusy(true);
    try {
      const { data: order } = await api.post('/api/orders', {
        items: items.map((i) => ({ product: i._id, qty: i.qty })),
        address,
        paymentMethod: payment,
        promoCode: promo?.code || '',
      });

      if (payment === 'card') {
        const { data } = await api.post('/api/payment/create-checkout-session', { orderId: order._id });
        clear();
        window.location.href = data.url; // off to Stripe
        return;
      }

      clear();
      toast.success('Order placed — the kitchen has it!');
      navigate(`/order/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place the order');
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <Page className="container-x py-24 text-center">
        <h1 className="h-display text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add something delicious first.</p>
        <button onClick={() => navigate('/menu')} className="btn-gold mt-6">Browse the menu</button>
      </Page>
    );
  }

  return (
    <Page className="container-x py-12">
      <p className="eyebrow text-center">Almost there</p>
      <h1 className="h-display mt-1 text-center text-4xl">Checkout</h1>

      <form onSubmit={placeOrder} className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1.4fr,1fr]">
        <div className="space-y-6">
          {/* address */}
          <section className="card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <MapPin size={19} className="text-gold" /> Delivery address
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="street">Street address</label>
                <input id="street" required className="input" placeholder="House 14, Street 5" value={address.street} onChange={set('street')} />
              </div>
              <div>
                <label className="label" htmlFor="area">Area</label>
                <input id="area" required className="input" placeholder="Gulberg III" value={address.area} onChange={set('area')} />
              </div>
              <div>
                <label className="label" htmlFor="city">City</label>
                <input id="city" required className="input" value={address.city} onChange={set('city')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="cphone">Phone (rider will call this number)</label>
                <input id="cphone" required className="input" placeholder="03xx-xxxxxxx" value={address.phone} onChange={set('phone')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="note">Delivery note <span className="text-muted/60">(optional)</span></label>
                <input id="note" className="input" placeholder="Gate code, landmark, spice level…" value={address.note} onChange={set('note')} />
              </div>
            </div>
          </section>

          {/* payment */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Payment</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { id: 'cod', icon: Banknote, title: 'Cash on delivery', text: 'Pay the rider at your door' },
                { id: 'card', icon: CreditCard, title: 'Card (Stripe)', text: 'Secure checkout, pay now' },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-300 ${
                    payment === m.id ? 'border-gold bg-gold/10 shadow-gold' : 'border-white/10 hover:border-gold/40'
                  }`}
                >
                  <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="sr-only" />
                  <m.icon size={20} className={payment === m.id ? 'text-gold' : 'text-muted'} />
                  <span>
                    <span className="block font-medium">{m.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{m.text}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="card h-fit p-6 sm:p-8 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i._id} className="flex items-center gap-3">
                <img src={i.image} alt="" className="h-11 w-11 rounded-full border border-gold/20 object-cover" />
                <span className="flex-1">{i.name} <span className="text-muted">× {i.qty}</span></span>
                <span className="text-cream/90">Rs {(i.price * i.qty).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          {/* promo code */}
          <div className="mt-5 border-t border-white/5 pt-4">
            {promo ? (
              <div className="flex items-center justify-between rounded-xl border border-leaf/30 bg-leaf/10 px-3.5 py-2.5 text-sm">
                <span className="inline-flex items-center gap-2 text-leaf">
                  <TicketPercent size={16} /> {promo.code} · Rs {discount.toLocaleString()} off
                </span>
                <button type="button" onClick={() => { setPromo(null); setPromoInput(''); }} aria-label="Remove promo code" className="rounded-full p-1 text-muted transition hover:bg-white/5 hover:text-ember">
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  className="input flex-1 uppercase placeholder:normal-case"
                  placeholder="Promo code (try ZAIQA10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyPromo(); } }}
                  aria-label="Promo code"
                />
                <button type="button" onClick={applyPromo} disabled={checking} className="btn-ghost !px-4 text-sm">
                  {checking ? '…' : 'Apply'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-white/5 pt-4 text-sm">
            <div className="flex justify-between text-muted"><span>Subtotal</span><span>Rs {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-muted"><span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee}`}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-leaf"><span>Promo ({promo.code})</span><span>− Rs {discount.toLocaleString()}</span></div>
            )}
            <div className="flex justify-between pt-2 font-display text-lg font-bold">
              <span>Total</span><span className="text-goldlight">Rs {grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <button className="btn-gold mt-6 w-full" disabled={busy}>
            {busy ? 'Placing order…' : payment === 'card' ? 'Pay & place order' : 'Place order'}
          </button>
          <p className="mt-3 text-center text-xs text-muted">Estimated delivery: 40–50 minutes</p>
        </aside>
      </form>
    </Page>
  );
}
