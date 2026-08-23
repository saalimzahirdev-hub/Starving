import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatsCard from '../../components/admin/StatsCard';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#c9a84c','#27904e','#60a5fa','#f97316','#a78bfa','#f87171','#4ade80'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 rounded-xl text-xs">
        <p className="text-brand-gold font-semibold">{label}</p>
        <p className="text-white mt-0.5">{formatPrice(payload[0]?.value || payload[0]?.value || 0)}</p>
      </div>
    );
  }
  return null;
};

export default function AdminReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const weekly = orderService.getWeeklyRevenue();
  const topItems = orderService.getTopItems();
  const allOrders = orderService.getAll();

  const totalRevenue = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = allOrders.length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const cancelRate = totalOrders > 0 ? Math.round((allOrders.filter(o => o.status === 'cancelled').length / totalOrders) * 100) : 0;

  // Category breakdown
  const catMap = {};
  allOrders.filter(o => o.status !== 'cancelled').forEach(order => {
    (order.items || []).forEach(item => {
      // rough category from name
      const cat = item.name.toLowerCase().includes('burger') ? 'Burgers' :
                  item.name.toLowerCase().includes('pizza') ? 'Pizza' :
                  item.name.toLowerCase().includes('roll') ? 'Rolls' :
                  item.name.toLowerCase().includes('wing') ? 'Wings' :
                  item.name.toLowerCase().includes('pasta') ? 'Pasta' :
                  item.name.toLowerCase().includes('fries') ? 'Sides' : 'Other';
      catMap[cat] = (catMap[cat] || 0) + (item.quantity || 1);
    });
  });
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  const handlePrint = () => window.print();

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <AdminHeader title="Reports" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Total Revenue"  value={formatPrice(totalRevenue)} icon={TrendingUp} color="gold" />
            <StatsCard label="Total Orders"   value={totalOrders}                icon={BarChart3}  color="green" />
            <StatsCard label="Avg Order Value" value={formatPrice(avgOrder)}     icon={TrendingUp} color="blue" />
            <StatsCard label="Cancellation Rate" value={`${cancelRate}%`}        icon={BarChart3}  color="red" />
          </div>

          <div className="flex justify-end">
            <button onClick={handlePrint} className="btn-outline-gold text-xs py-2 px-4 flex items-center gap-2">
              <Download size={13} /> Export / Print
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weekly Revenue */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-4">Weekly Revenue (PKR)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weekly} margin={{ left: -20 }}>
                  <XAxis dataKey="day" tick={{ fill: 'rgba(232,240,236,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(232,240,236,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,168,76,0.06)' }} />
                  <Bar dataKey="revenue" fill="#c9a84c" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Orders per day */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-4">Daily Order Count</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weekly} margin={{ left: -20 }}>
                  <XAxis dataKey="day" tick={{ fill: 'rgba(232,240,236,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(232,240,236,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ stroke: 'rgba(201,168,76,0.2)' }} contentStyle={{ background: '#16211a', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="orders" stroke="#c9a84c" strokeWidth={2} dot={{ fill: '#c9a84c', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            {catData.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="font-semibold text-white mb-4">Sales by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#16211a', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Items Table */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-4">Top 10 Selling Items</h3>
              {topItems.length === 0 ? (
                <p className="text-white/35 text-sm text-center py-8">No sales data yet.</p>
              ) : (
                <div className="space-y-3">
                  {topItems.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="text-brand-gold font-bold text-xs w-5">#{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/70 truncate">{item.name}</span>
                          <span className="text-white/40 ml-2 flex-shrink-0">{item.count}x sold</span>
                        </div>
                        <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(item.count / (topItems[0]?.count || 1)) * 100}%`, background: COLORS[i % COLORS.length] }}
                          />
                        </div>
                      </div>
                      <span className="text-brand-gold text-xs font-semibold flex-shrink-0">{formatPrice(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
