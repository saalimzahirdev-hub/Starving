import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Check, X, Trash2, Crown, MessageSquare,
  Clock, RefreshCw, Eye, EyeOff, Filter, Search
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending:  'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/15 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function StarDisplay({ rating, size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} className={s <= rating ? 'text-brand-gold fill-brand-gold' : 'text-white/15'} />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, avgRating: '0.0' });
  const [filter, setFilter] = useState('all'); // all | pending | approved | rejected
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const refresh = () => {
    setReviews(reviewService.getAll());
    setStats(reviewService.getStats());
  };

  useEffect(() => {
    refresh();
    window.addEventListener('starving:reviews_updated', refresh);
    window.addEventListener('storage', (e) => { if (e.key === 'starving_reviews') refresh(); });

    let channel = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('starving_reviews_channel');
        channel.onmessage = () => {
          refresh();
          toast('📝 New review submitted!', {
            style: { background: '#16211a', color: '#e8f0ec', border: '1px solid rgba(201,168,76,0.25)' },
          });
        };
      }
    } catch { /* ignore */ }

    return () => {
      window.removeEventListener('starving:reviews_updated', refresh);
      if (channel) channel.close();
    };
  }, []);

  const handleApprove = (id) => {
    reviewService.approve(id);
    refresh();
    toast.success('Review approved ✓');
  };

  const handleReject = (id) => {
    reviewService.reject(id);
    refresh();
    toast.error('Review rejected');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    reviewService.delete(id);
    setSelected(null);
    refresh();
    toast.success('Review deleted');
  };

  const handleToggleFeatured = (id) => {
    reviewService.toggleFeatured(id);
    refresh();
  };

  const filtered = reviews.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.text.toLowerCase().includes(q) || (r.orderItem || '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const statCards = [
    { label: 'Total Reviews',    value: stats.total,    color: 'text-white'          },
    { label: 'Pending Approval', value: stats.pending,  color: 'text-yellow-400'     },
    { label: 'Approved',         value: stats.approved, color: 'text-green-400'      },
    { label: 'Avg Rating',       value: stats.avgRating + '★', color: 'text-brand-gold' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--surface)' }}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-white/5 px-4 sm:px-6 py-4 flex items-center gap-4"
          style={{ background: 'rgba(13,27,20,0.95)', backdropFilter: 'blur(12px)' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden icon-btn">
            <Filter size={18} />
          </button>
          <div>
            <h1 className="font-brand text-xl text-white flex items-center gap-2">
              <MessageSquare size={20} className="text-brand-gold" /> Reviews
            </h1>
            <p className="text-white/40 text-xs">Manage customer reviews</p>
          </div>
          <button onClick={refresh} className="ml-auto icon-btn" title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statCards.map(({ label, value, color }) => (
              <div key={label} className="glass-card p-4">
                <p className={`font-brand text-2xl ${color}`}>{value}</p>
                <p className="text-white/45 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Pending badge */}
          {stats.pending > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3"
            >
              <Clock size={16} className="text-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">
                {stats.pending} review{stats.pending !== 1 ? 's' : ''} awaiting your approval
              </span>
              <button onClick={() => setFilter('pending')} className="ml-auto text-yellow-400 text-xs underline underline-offset-2">
                View pending
              </button>
            </motion.div>
          )}

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                    filter === f
                      ? 'bg-brand-gold text-surface border-brand-gold'
                      : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  {f} {f !== 'all' && `(${stats[f] ?? 0})`}
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search reviews…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 py-2 text-sm w-full sm:w-56"
              />
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-white/30">
                <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                <p>No reviews found</p>
              </div>
            )}
            <AnimatePresence>
              {filtered.map((r, i) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className={`glass-card p-5 flex flex-col gap-3 cursor-pointer transition-all hover:border-brand-gold/30 ${
                    selected?.id === r.id ? 'border-brand-gold/50 shadow-[0_0_15px_rgba(201,168,76,0.15)]' : ''
                  }`}
                  onClick={() => setSelected(selected?.id === r.id ? null : r)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center text-brand-gold font-bold text-sm flex-shrink-0">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{r.name}</p>
                        {r.orderItem && <p className="text-white/40 text-[10px]">Ordered: {r.orderItem}</p>}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize flex-shrink-0 ${STATUS_COLORS[r.status]}`}>
                      {r.status}
                    </span>
                  </div>

                  <StarDisplay rating={r.rating} />
                  <p className="text-white/60 text-sm leading-relaxed italic line-clamp-3">"{r.text}"</p>
                  <p className="text-white/25 text-[10px]">
                    {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap mt-1" onClick={e => e.stopPropagation()}>
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(r.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-400 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all">
                          <Check size={12} /> Approve
                        </button>
                        <button onClick={() => handleReject(r.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all">
                          <X size={12} /> Reject
                        </button>
                      </>
                    )}
                    {r.status === 'rejected' && (
                      <button onClick={() => handleApprove(r.id)}
                        className="flex items-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/25 text-green-400 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all">
                        <Check size={12} /> Re-approve
                      </button>
                    )}
                    {r.status === 'approved' && (
                      <button
                        onClick={() => handleToggleFeatured(r.id)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all ${
                          r.isFeatured
                            ? 'bg-brand-gold/20 border-brand-gold/40 text-brand-gold'
                            : 'bg-white/5 border-white/10 text-white/50 hover:border-brand-gold/30'
                        }`}
                      >
                        <Crown size={12} /> {r.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                    )}
                    <button onClick={() => handleDelete(r.id)}
                      className="flex items-center gap-1.5 bg-red-500/8 hover:bg-red-500/18 border border-red-500/20 text-red-400/70 rounded-lg px-3 py-1.5 text-xs transition-all ml-auto">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
