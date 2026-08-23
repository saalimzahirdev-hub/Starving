import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, Search, Upload } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { menuService } from '../../services/menuService';
import { categories } from '../../data/menuData';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', category: 'Burgers', description: '', image: '',
  isAvailable: true, isPopular: false, isFeatured: false,
  variants: [{ size: 'Regular', label: 'Regular', price: '', originalPrice: '' }],
  addons: [],
};

export default function AdminMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => setItems(menuService.getAll());
  useEffect(() => { refresh(); }, []);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({
      ...item,
      variants: item.variants.map(v => ({ ...v, price: String(v.price), originalPrice: String(v.originalPrice) })),
    });
    setEditItem(item);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Item name is required'); return; }
    if (!form.variants.some(v => v.price)) { toast.error('At least one variant price required'); return; }

    setSaving(true);
    await new Promise(r => setTimeout(r, 300));

    const payload = {
      ...form,
      variants: form.variants.map(v => ({
        ...v,
        price: Number(v.price),
        originalPrice: Number(v.originalPrice) || Number(v.price),
      })),
    };

    if (editItem) {
      menuService.update(editItem.id, payload);
      toast.success('Item updated!', { style: { background: '#16211a', color: '#e8f0ec' } });
    } else {
      menuService.create(payload);
      toast.success('Item added!', { style: { background: '#16211a', color: '#e8f0ec' } });
    }
    refresh(); setShowForm(false); setSaving(false);
  };

  const handleDelete = () => {
    menuService.delete(deleteTarget.id);
    refresh();
    setDeleteTarget(null);
    toast.success('Item deleted.');
  };

  const toggleAvail = (id) => {
    menuService.toggleAvailability(id);
    refresh();
  };

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { size: '', label: '', price: '', originalPrice: '' }] }));
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));
  const updateVariant = (i, key, val) => setForm(f => ({
    ...f,
    variants: f.variants.map((v, idx) => idx === i ? { ...v, [key]: val } : v),
  }));

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <AdminHeader title="Menu Management" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 space-y-5">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" placeholder="Search items..." className="input-field pl-10 text-sm"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={openAdd} className="btn-gold flex-shrink-0" id="add-menu-item">
              <Plus size={16} /> Add Item
            </button>
          </div>

          <p className="text-white/30 text-xs">{filtered.length} items</p>

          {/* Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Item', 'Category', 'Starting Price', 'Sizes', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-white/35 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map(item => (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-card flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                                onError={e => e.target.style.display='none'} />
                            </div>
                            <div>
                              <p className="font-medium text-white text-xs">{item.name}</p>
                              {item.isPopular && <span className="text-[9px] text-brand-gold">⭐ Popular</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white/55 text-xs">{item.category}</td>
                        <td className="px-4 py-3">
                          <span className="price-current text-xs">{formatPrice(item.variants[0]?.price || 0)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {item.variants.map(v => (
                              <span key={v.size} className="text-[10px] border border-white/10 rounded px-1.5 py-0.5 text-white/40">{v.size}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleAvail(item.id)}
                            className={`flex items-center gap-1 text-xs font-semibold transition-colors ${item.isAvailable ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {item.isAvailable ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(item)} className="icon-btn w-7 h-7">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => setDeleteTarget(item)} className="w-7 h-7 rounded-lg border border-red-500/25 bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-white/30 text-sm">No items found.</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{ background: 'var(--surface-card)', border: '1px solid var(--border-gold)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-white">{editItem ? 'Edit Item' : 'Add New Item'}</h3>
                <button onClick={() => setShowForm(false)} className="icon-btn w-7 h-7"><X size={14} /></button>
              </div>

              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="input-label">Item Name *</label>
                    <input type="text" className="input-field" placeholder="e.g. Crunch Factor Roll"
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="input-label">Category *</label>
                    <select className="input-field" value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {categories.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id} style={{ background: '#16211a' }}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="input-label">Description</label>
                    <textarea rows={2} className="input-field resize-none" placeholder="Brief description..."
                      value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="input-label">Image URL</label>
                    <input type="text" className="input-field" placeholder="/images/menu/..."
                      value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                  </div>
                </div>

                {/* Variants */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="input-label">Sizes / Variants *</label>
                    <button type="button" onClick={addVariant} className="text-brand-gold text-xs hover:underline flex items-center gap-1">
                      <Plus size={12} /> Add Size
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                        <input type="text" className="input-field py-2 text-xs" placeholder="Size (e.g. XL)"
                          value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} />
                        <input type="number" className="input-field py-2 text-xs" placeholder="Price (PKR)"
                          value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} />
                        <input type="number" className="input-field py-2 text-xs" placeholder="Original price"
                          value={v.originalPrice} onChange={e => updateVariant(i, 'originalPrice', e.target.value)} />
                        {form.variants.length > 1 && (
                          <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-300 p-1">
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-4 flex-wrap">
                  {[
                    { key: 'isAvailable', label: 'Available' },
                    { key: 'isPopular',   label: 'Popular'   },
                    { key: 'isFeatured',  label: 'Featured'  },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                        className={`w-9 h-5 rounded-full transition-all relative ${form[key] ? 'bg-brand-gold' : 'bg-white/15'}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${form[key] ? 'left-4.5' : 'left-0.5'}`} style={{ left: form[key] ? '18px' : '2px' }} />
                      </div>
                      <span className="text-xs text-white/60">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold flex-1 justify-center text-xs py-2.5">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-gold flex-1 justify-center text-xs py-2.5 disabled:opacity-60">
                    {saving ? 'Saving...' : <><Check size={14} /> {editItem ? 'Update' : 'Add Item'}</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
