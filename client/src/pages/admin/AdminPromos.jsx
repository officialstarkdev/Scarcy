import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarClock, Pencil, Plus, TicketPercent, Trash2, X } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const EMPTY = { code: '', type: 'percent', value: 10, minOrder: 0, maxDiscount: 0, usageLimit: 0, expiresAt: '', isActive: true };

const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function AdminPromos() {
  const [promos, setPromos] = useState(null);
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => api.get('/api/promos').then(({ data }) => setPromos(data)).catch(() => setPromos([]));
  useEffect(() => {
    void load();
  }, []);

  const openEdit = (p) => setModal({ ...p, expiresAt: p.expiresAt ? p.expiresAt.slice(0, 10) : '' });
  const set = (k) => (e) => setModal({ ...modal, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      ...modal,
      code: modal.code.trim().toUpperCase(),
      value: Number(modal.value),
      minOrder: Number(modal.minOrder) || 0,
      maxDiscount: Number(modal.maxDiscount) || 0,
      usageLimit: Number(modal.usageLimit) || 0,
      expiresAt: modal.expiresAt || null,
    };
    try {
      if (modal._id) {
        await api.put(`/api/promos/${modal._id}`, payload);
        toast.success('Promo updated');
      } else {
        await api.post('/api/promos', payload);
        toast.success('Promo created');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save the promo');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete promo "${p.code}"?`)) return;
    try {
      await api.delete(`/api/promos/${p._id}`);
      toast.success('Promo deleted');
      setPromos((prev) => prev.filter((x) => x._id !== p._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete the promo');
    }
  };

  const toggleActive = async (p) => {
    const { data } = await api.put(`/api/promos/${p._id}`, { isActive: !p.isActive });
    setPromos((prev) => prev.map((x) => (x._id === p._id ? data : x)));
  };

  const expired = (p) => p.expiresAt && new Date(p.expiresAt) < new Date();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-forest">Promo codes</h2>
        <button onClick={() => setModal({ ...EMPTY })} className="btn-forest !px-5 !py-2 !text-sm"><Plus size={16} /> New promo</button>
      </div>

      {!promos ? (
        <Loader label="Fetching promos…" />
      ) : promos.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">No promo codes yet — create your first deal.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {promos.map((p) => (
            <div key={p._id} className={`card flex flex-wrap items-center gap-4 p-4 ${!p.isActive || expired(p) ? 'opacity-60' : ''}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10 text-forest"><TicketPercent size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-semibold tracking-widest text-forest">{p.code}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {p.type === 'percent' ? (
                    <>
                      <span className="font-price font-semibold">{p.value}%</span> off
                      {p.maxDiscount > 0 && <> · capped at <span className="font-price font-semibold">Rs {p.maxDiscount.toLocaleString()}</span></>}
                    </>
                  ) : (
                    <><span className="font-price font-semibold">Rs {p.value.toLocaleString()}</span> off</>
                  )}
                  {p.minOrder > 0 && <> · min order <span className="font-price font-semibold">Rs {p.minOrder.toLocaleString()}</span></>}
                </p>
              </div>
              <span className="text-xs text-muted">
                {p.usedCount} used{p.usageLimit > 0 && ` / ${p.usageLimit}`}
              </span>
              {p.expiresAt && (
                <span className={`inline-flex items-center gap-1 text-xs ${expired(p) ? 'text-ember' : 'text-muted'}`}>
                  <CalendarClock size={13} /> {expired(p) ? 'Expired' : `Till ${fmtDate(p.expiresAt)}`}
                </span>
              )}
              <button
                onClick={() => toggleActive(p)}
                role="switch"
                aria-checked={p.isActive}
                aria-label={`${p.code} active`}
                className={`relative h-6 w-11 rounded-full transition-colors ${p.isActive ? 'bg-leaf/70' : 'bg-sand'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${p.isActive ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
              <button onClick={() => openEdit(p)} aria-label={`Edit ${p.code}`} className="rounded-full p-2 text-muted transition hover:bg-creamdeep hover:text-forest"><Pencil size={16} /></button>
              <button onClick={() => remove(p)} aria-label={`Delete ${p.code}`} className="rounded-full p-2 text-muted transition hover:bg-ember/10 hover:text-ember"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-forestdeep/50 backdrop-blur-sm" onClick={() => setModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed inset-x-4 top-[8%] z-50 mx-auto max-h-[84vh] w-auto max-w-md overflow-y-auto rounded-3xl border border-sand bg-cream p-6 shadow-lift sm:p-8"
              role="dialog" aria-label={modal._id ? 'Edit promo' : 'New promo'}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-forest">{modal._id ? 'Edit promo' : 'Create a promo'}</h3>
                <button onClick={() => setModal(null)} aria-label="Close" className="rounded-full p-2 text-muted hover:bg-white"><X size={18} /></button>
              </div>
              <form onSubmit={save} className="mt-5 space-y-4">
                <div>
                  <label className="label">Code</label>
                  <input required className="input font-mono uppercase tracking-widest" value={modal.code} onChange={set('code')} placeholder="EIDMUBARAK" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Type</label>
                    <select className="input" value={modal.type} onChange={set('type')}>
                      <option value="percent">Percent off</option>
                      <option value="flat">Flat Rs off</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">{modal.type === 'percent' ? 'Percent (%)' : 'Amount (Rs)'}</label>
                    <input required type="number" min="1" className="input" value={modal.value} onChange={set('value')} />
                  </div>
                  <div>
                    <label className="label">Min order (Rs)</label>
                    <input type="number" min="0" className="input" value={modal.minOrder} onChange={set('minOrder')} />
                  </div>
                  {modal.type === 'percent' ? (
                    <div>
                      <label className="label">Max discount (Rs, 0 = none)</label>
                      <input type="number" min="0" className="input" value={modal.maxDiscount} onChange={set('maxDiscount')} />
                    </div>
                  ) : (
                    <div>
                      <label className="label">Usage limit (0 = ∞)</label>
                      <input type="number" min="0" className="input" value={modal.usageLimit} onChange={set('usageLimit')} />
                    </div>
                  )}
                  {modal.type === 'percent' && (
                    <div>
                      <label className="label">Usage limit (0 = ∞)</label>
                      <input type="number" min="0" className="input" value={modal.usageLimit} onChange={set('usageLimit')} />
                    </div>
                  )}
                  <div>
                    <label className="label">Expires</label>
                    <input type="date" className="input" value={modal.expiresAt} onChange={set('expiresAt')} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="checkbox" checked={modal.isActive} onChange={set('isActive')} className="accent-forest" /> Active
                </label>
                <button className="btn-forest w-full" disabled={busy}>{busy ? 'Saving…' : modal._id ? 'Save changes' : 'Create promo'}</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
