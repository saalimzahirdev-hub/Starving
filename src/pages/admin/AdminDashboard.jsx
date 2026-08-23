import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, DollarSign, TrendingUp, RefreshCw, Zap, UtensilsCrossed, ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatsCard from '../../components/admin/StatsCard';
import OrderCard from '../../components/admin/OrderCard';
import { useOrders } from '../../context/OrderContext';
import { useApp } from '../../context/AppContext';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 rounded-xl text-xs">
        <p className="text-brand-gold font-semibold">{label}</p>
        <p className="text-white mt-0.5">{formatPrice(payload[0]?.value || 0)}</p>
        {payload[1] && <p className="text-white/60">{payload[1].value} orders</p>}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { orders } = useOrders();
  const { settings, toggleRestaurant } = useApp();

  const stats = orderService.getTodayStats();
  const weeklyData = orderService.getWeeklyRevenue();
  const topItems = orderService.getTopItems().slice(0, 5);

  // Recent orders — latest 5
  const recentOrders = orders.slice(0, 5);
  // Pending orders needing attention
  const pendingOrders = orders.filter(o => o.status === 'received');

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
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
        <AdminHeader title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 space-y-6">

          {/* Pending alert */}
          {pendingOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-500/12 border border-orange-500/30 rounded-xl px-5 py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <p className="text-orange-400 font-semibold text-sm">
                  🔔 {pendingOrders.length} new order{pendingOrders.length > 1 ? 's' : ''} waiting for acceptance!
                </p>
              </div>
              <Link to="/admin/orders" className="text-orange-400 text-xs font-semibold flex items-center gap-1 hover:text-orange-300 transition-colors flex-shrink-0">
                View Orders <ArrowRight size={12} />
              </Link>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Orders Today"
              value={stats.total}
              icon={ShoppingBag}
              color="gold"
            />
            <StatsCard
              label="Pending"
              value={stats.pending}
              sub="Need attention"
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
              label="Today Revenue"
              value={formatPrice(stats.revenue)}
              icon={DollarSign}
              color="blue"
            />
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={15} className="text-brand-gold" />
              <h2 className="font-semibold text-white text-sm">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Toggle restaurant */}
              <button
                onClick={handleToggleRestaurant}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center ${
                  settings.restaurantOpen
                    ? 'border-green-500/30 bg-green-500/8 hover:bg-green-500/15'
                    : 'border-red-500/30 bg-red-500/8 hover:bg-red-500/15'
                }`}
              >
                {settings.restaurantOpen
                  ? <ToggleRight size={22} className="text-green-400" />
                  : <ToggleLeft size={22} className="text-red-400" />}
                <span className={`text-xs font-semibold ${settings.restaurantOpen ? 'text-green-400' : 'text-red-400'}`}>
                  {settings.restaurantOpen ? 'Open → Close' : 'Closed → Open'}
                </span>
              </button>
              {/* View pending orders */}
              <Link
                to="/admin/orders"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-orange-500/20 bg-orange-500/8 hover:bg-orange-500/15 transition-all text-center"
              >
                <ShoppingBag size={22} className="text-orange-400" />
                <span className="text-xs font-semibold text-orange-400">
                  {pendingOrders.length > 0 ? `${pendingOrders.length} Pending` : 'All Orders'}
                </span>
              </Link>
              {/* Manage menu */}
              <Link
                to="/admin/menu"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-brand-gold/20 bg-brand-gold/8 hover:bg-brand-gold/15 transition-all text-center"
              >
                <UtensilsCrossed size={22} className="text-brand-gold" />
                <span className="text-xs font-semibold text-brand-gold">Manage Menu</span>
              </Link>
              {/* All time revenue */}
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-blue-500/20 bg-blue-500/8 text-center">
                <DollarSign size={22} className="text-blue-400" />
                <span className="text-xs font-semibold text-blue-400">{formatPrice(totalRevenue)}</span>
                <span className="text-[10px] text-white/30">All-Time Rev.</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Revenue Chart */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Weekly Revenue</h2>
                <TrendingUp size={16} className="text-brand-gold" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fill: 'rgba(232,240,236,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(232,240,236,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,168,76,0.06)' }} />
                  <Bar dataKey="revenue" fill="#c9a84c" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Items */}
            <div className="glass-card p-5">
              <h2 className="font-semibold text-white mb-4">Top Selling Items</h2>
              {topItems.length === 0 ? (
                <p className="text-white/35 text-sm text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {topItems.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="text-brand-gold font-bold text-sm w-5 flex-shrink-0">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{item.name}</p>
                        <div className="w-full h-1 bg-white/8 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-brand-gold rounded-full"
                            style={{ width: `${(item.count / (topItems[0]?.count || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-white/50 text-xs flex-shrink-0">{item.count}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Recent Orders</h2>
              <div className="flex items-center gap-3">
                <span className="text-white/35 text-xs">{orders.length} total</span>
                <Link to="/admin/orders" className="text-brand-gold/70 text-xs hover:text-brand-gold transition-colors flex items-center gap-1">
                  View All <ArrowRight size={11} />
                </Link>
              </div>
            </div>
            {recentOrders.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <p className="text-5xl mb-3">📋</p>
                <p className="text-white/40">No orders yet. They'll appear here when customers order.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
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
