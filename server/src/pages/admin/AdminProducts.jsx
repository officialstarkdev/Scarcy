import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, Pencil, Plus, Star, Trash2, Upload, X } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const EMPTY = {
  name: '', description: '', price: '', image: '', category: '',
  prepTime: 20, serves: 1, tags: [], isAvailable: true, isFeatured: false,
};
const ALL_TAGS = ['spicy', 'veg', 'bestseller', 'new', 'chef-special'];

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null); // null | { ...form, _id? }
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return toast.error('Image must be under 3 MB');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setModal((m) => ({ ...m, image: data.url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const load = () => {
    api.get('/api/products').then(({ data }) => setProducts(data)).catch(() => setProducts([]));
    api.get('/api/categories').then(({ data }) => setCategories(data)).catch(() => {});
  };
  useEffect(() => {
    void load();
  }, []);

  const openNew = () => setModal({ ...EMPTY, category: categories[0]?._id || '' });
  const openEdit = (p) => setModal({ ...p, category: p.category?._id || p.category });

  const set = (k) => (e) => setModal({ ...modal, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const toggleTag = (t) =>
    setModal((m) => ({ ...m, tags: m.tags.includes(t) ? m.tags.filter((x) => x !== t) : [...m.tags, t] }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = { ...modal, price: Number(modal.price), prepTime: Number(modal.prepTime), serves: Number(modal.serves) };
    try {
      if (modal._id) {
        await api.put(`/api/products/${modal._id}`, payload);
        toast.success('Dish updated');
      } else {
        await api.post('/api/products', payload);
        toast.success('Dish added to the menu');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save the dish');
    } finally {
      setBusy(false);
    }
  };

  const removeDish = async (p) => {
    if (!window.confirm(`Remove "${p.name}" from the menu? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/products/${p._id}`);
      toast.success('Dish removed');
      setProducts((prev) => prev.filter((x) => x._id !== p._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove the dish');
    }
  };

  const toggleAvailable = async (p) => {
    const { data } = await api.put(`/api/products/${p._id}`, { isAvailable: !p.isAvailable });
    setProducts((prev) => prev.map((x) => (x._id === p._id ? { ...x, isAvailable: data.isAvailable } : x)));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Menu items</h2>
        <button onClick={openNew} className="btn-gold !px-5 !py-2 text-sm"><Plus size={16} /> Add dish</button>
      </div>

      {!products ? (
        <Loader label="Loading the menu…" />
      ) : (
        <div className="mt-6 space-y-2">
          {products.map((p) => (
            <div key={p._id} className="card flex flex-wrap items-center gap-4 p-3.5">
              <img src={p.image} alt="" className="h-12 w-12 rounded-full border border-gold/20 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="text-xs text-muted">{p.category?.name} · Rs {p.price.toLocaleString()} ·{' '}
                  <Star size={11} className="inline text-gold" fill="currentColor" /> {p.rating?.toFixed(1)}
                </p>
              </div>
              <button
                onClick={() => toggleAvailable(p)}
                role="switch"
                aria-checked={p.isAvailable}
                aria-label={`${p.name} availability`}
                className={`relative h-6 w-11 rounded-full transition-colors ${p.isAvailable ? 'bg-leaf/70' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream transition-all ${p.isAvailable ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
              <button onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`} className="rounded-full p-2 text-muted transition hover:bg-white/5 hover:text-gold"><Pencil size={16} /></button>
              <button onClick={() => removeDish(p)} aria-label={`Delete ${p.name}`} className="rounded-full p-2 text-muted transition hover:bg-ember/10 hover:text-ember"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm" onClick={() => setModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed inset-x-4 top-[6%] z-50 mx-auto max-h-[88vh] w-auto max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-coal p-6 sm:p-8"
              role="dialog" aria-label={modal._id ? 'Edit dish' : 'Add dish'}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">{modal._id ? 'Edit dish' : 'Add a new dish'}</h3>
                <button onClick={() => setModal(null)} aria-label="Close" className="rounded-full p-2 hover:bg-white/5"><X size={18} /></button>
              </div>
              <form onSubmit={save} className="mt-5 space-y-4">
                <div>
                  <label className="label">Name</label>
                  <input required className="input" value={modal.name} onChange={set('name')} placeholder="Chicken Karahi" />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea className="input min-h-[80px]" value={modal.description} onChange={set('description')} placeholder="What makes it worth ordering?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Price (Rs)</label>
                    <input required type="number" min="0" className="input" value={modal.price} onChange={set('price')} />
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select required className="input" value={modal.category} onChange={set('category')}>
                      {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Prep time (min)</label>
                    <input type="number" min="1" className="input" value={modal.prepTime} onChange={set('prepTime')} />
                  </div>
                  <div>
                    <label className="label">Serves</label>
                    <input type="number" min="1" className="input" value={modal.serves} onChange={set('serves')} />
                  </div>
                </div>
                <div>
                  <label className="label">Dish photo</label>
                  <div className="flex items-start gap-3">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-gold/30 bg-white/[0.03]">
                      {modal.image ? (
                        <img src={modal.image} alt="Dish preview" className="h-full w-full object-cover" />
                      ) : (
                        <ImagePlus size={20} className="text-muted" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={uploadImage} />
                      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-ghost w-full !py-2 text-sm">
                        <Upload size={15} /> {uploading ? 'Uploading…' : 'Upload from device'}
                      </button>
                      <input
                        required className="input !py-2 text-xs" value={modal.image} onChange={set('image')}
                        placeholder="…or paste an image URL" aria-label="Image URL"
                      />
                    </div>
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted">JPG, PNG or WEBP, up to 3 MB. Square photos look best on the plate.</p>
                </div>
                <div>
                  <label className="label">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TAGS.map((t) => (
                      <button
                        type="button" key={t} onClick={() => toggleTag(t)}
                        className={`rounded-full px-3.5 py-1.5 text-xs capitalize transition ${
                          modal.tags.includes(t) ? 'bg-gold text-ink' : 'border border-white/10 text-muted hover:border-gold/50'
                        }`}
                      >
                        {t.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={modal.isAvailable} onChange={set('isAvailable')} className="accent-gold" /> Available
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={modal.isFeatured} onChange={set('isFeatured')} className="accent-gold" /> Featured on home
                  </label>
                </div>
                <button className="btn-gold w-full" disabled={busy}>{busy ? 'Saving…' : modal._id ? 'Save changes' : 'Add to menu'}</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
