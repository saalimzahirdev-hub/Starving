import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, DollarSign, TrendingUp, RefreshCw, Zap, UtensilsCrossed, ToggleLeft, ToggleRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatsCard from '../../components/admin/StatsCard';
import OrderCard from '../../components/admin/OrderCard';
import { useOrders } from '../../context/OrderContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { orders } = useOrders();
  const { settings, toggleRestaurant } = useApp();
  const { user, isOwner } = useAuth();

  const stats = orderService.getTodayStats();
  const weeklyData = orderService.getWeeklyRevenue();
  const topItems = orderService.getTopItems().slice(0, 5);

  // Recent orders across all customers
  const recentOrders = orders.slice(0, 5);
  // Pending orders needing kitchen attention
  const pendingOrders = orders.filter((o) => o.status === 'received');

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const handleToggleRestaurant = () => {
    const updated = toggleRestaurant();
    toast.success(
      updated.restaurantOpen ? '🟢 Restaurant is now OPEN' : '🔴 Restaurant is now CLOSED',
      { style: { background: '#16211a', color: '#e8f0ec' } }
    );
  };

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <AdminHeader title="Central Order & Restaurant Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Pending alert banner */}
          {pendingOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-500/12 border border-orange-500/30 rounded-xl px-5 py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
                <p className="text-orange-400 font-semibold text-sm">
                  🔔 {pendingOrders.length} incoming customer order{pendingOrders.length > 1 ? 's' : ''} waiting for kitchen acceptance!
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="text-orange-400 text-xs font-semibold flex items-center gap-1 hover:text-orange-300 transition-colors flex-shrink-0"
              >
                View & Manage Orders <ArrowRight size={12} />
              </Link>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="All Orders Today"
              value={stats.total}
              icon={ShoppingBag}
              color="gold"
            />
            <StatsCard
              label="Pending Prep"
              value={stats.pending}
              sub="Need kitchen action"
              icon={Clock}
              color="orange"
            />
            <StatsCard
              label="Completed Today"
              value={stats.completed}
              icon={CheckCircle}
              color="green"
            />
            <StatsCard
              label="Today's Revenue"
              value={formatPrice(stats.revenue)}
              icon={DollarSign}
              color="blue"
            />
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={15} className="text-brand-gold" />
              <h2 className="font-semibold text-white text-sm">Quick Operations</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Toggle restaurant */}
              <button
                onClick={handleToggleRestaurant}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-brand-gold/30 flex items-center gap-3 text-left transition-all"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${settings.restaurantOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {settings.restaurantOpen ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Status</p>
                  <p className="text-[10px] text-white/40">{settings.restaurantOpen ? 'Open for Orders' : 'Closed'}</p>
                </div>
              </button>

              <Link
                to="/admin/orders"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-brand-gold/30 flex items-center gap-3 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-gold/15 text-brand-gold flex items-center justify-center">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Manage Orders</p>
                  <p className="text-[10px] text-white/40">{orders.length} total orders</p>
                </div>
              </Link>

              {isOwner && (
                <Link
                  to="/admin/menu"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-brand-gold/30 flex items-center gap-3 text-left transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <UtensilsCrossed size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Menu Editor</p>
                    <p className="text-[10px] text-white/40">Owner feature</p>
                  </div>
                </Link>
              )}

              {isOwner && (
                <Link
                  to="/admin/reports"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-brand-gold/30 flex items-center gap-3 text-left transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Analytics</p>
                    <p className="text-[10px] text-white/40">Revenue & Trends</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Recent Orders Stream */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                <ShoppingBag size={15} className="text-brand-gold" />
                Live Customer Orders Feed
              </h2>
              <Link to="/admin/orders" className="text-xs text-brand-gold hover:underline flex items-center gap-1">
                View all orders →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="glass-card p-8 text-center text-white/40 text-sm">
                No orders in the database yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
