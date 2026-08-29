import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw, ShoppingBag, Bell } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import OrderCard from '../../components/admin/OrderCard';
import { useOrders } from '../../context/OrderContext';
import { useDebounce } from '../../hooks/useDebounce';

const STATUS_FILTERS = [
  { key: 'all',       label: 'All Orders', color: 'text-white/60'    },
  { key: 'received',  label: 'New Orders', color: 'text-green-400'   },
  { key: 'preparing', label: 'Preparing',  color: 'text-orange-400'  },
  { key: 'ready',     label: 'Ready',      color: 'text-blue-400'    },
  { key: 'on_the_way',label: 'On the Way', color: 'text-purple-400'  },
  { key: 'delivered', label: 'Delivered',  color: 'text-green-400'   },
  { key: 'cancelled', label: 'Cancelled',  color: 'text-red-400'     },
];

export default function AdminOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Retrieves ALL orders placed by all customers from the central database
  const { orders } = useOrders();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    let result = [...orders];
    if (activeFilter !== 'all') {
      result = result.filter((o) => o.status === activeFilter);
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.phone?.includes(q) ||
          o.customerId?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, activeFilter, debouncedSearch]);

  // Count per status
  const counts = useMemo(() => {
    const c = { all: orders.length };
    orders.forEach((o) => {
      c[o.status] = (c[o.status] || 0) + 1;
    });
    return c;
  }, [orders]);

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <AdminHeader title="Orders Management (All Customers)" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 space-y-5">
          {/* Top Banner explaining Central Order Management */}
          <div className="bg-brand-gold/10 border border-brand-gold/25 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={16} className="text-brand-gold flex-shrink-0" />
              <span className="text-white/80">
                Centralized Live Order Hub — Viewing <strong>all {orders.length} orders</strong> placed by all customers.
              </span>
            </div>
            <span className="hidden sm:inline-block text-[11px] text-green-400 font-semibold">
              Live Real-Time Sync Active
            </span>
          </div>

          {/* Search + Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Phone, or Customer ID..."
                className="input-field pl-10 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="orders-search"
              />
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <RefreshCw size={12} />
              Auto-updating via BroadcastChannel
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 border transition-all ${
                  activeFilter === f.key
                    ? 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold'
                    : `border-white/10 bg-white/5 ${f.color} hover:border-white/20`
                }`}
              >
                {f.label}
                {counts[f.key] > 0 && (
                  <span
                    className={`min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 ${
                      activeFilter === f.key ? 'bg-brand-gold text-surface' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {counts[f.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results */}
          <p className="text-white/30 text-xs">
            Showing {filtered.length} order{filtered.length !== 1 ? 's' : ''} across all customers
          </p>

          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-white/40 text-sm">
                {search ? 'No customer orders match your search query.' : `No ${activeFilter === 'all' ? '' : activeFilter} orders.`}
              </p>
            </motion.div>
          ) : (
            <motion.div layout className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
