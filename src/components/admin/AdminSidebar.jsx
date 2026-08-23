import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed,
  BarChart3, Settings, LogOut, X, Crown
} from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { to: '/admin/orders',    label: 'Orders',    icon: ShoppingBag,     badge: 'pending' },
  { to: '/admin/menu',      label: 'Menu',      icon: UtensilsCrossed, badge: null },
  { to: '/admin/reports',   label: 'Reports',   icon: BarChart3,       badge: null },
  { to: '/admin/settings',  label: 'Settings',  icon: Settings,        badge: null },
];


export default function AdminSidebar({ open, onClose }) {
  const { logout } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  const pendingCount = orders.filter(o => o.status === 'received').length;

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <Logo size="sm" />
        <button onClick={onClose} className="lg:hidden icon-btn">
          <X size={16} />
        </button>
      </div>

      {/* Admin badge */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20">
          <Crown size={13} className="text-brand-gold" />
          <span className="text-brand-gold text-xs font-semibold tracking-wide">ADMIN PANEL</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, badge }) => {
          const badgeCount = badge === 'pending' ? pendingCount : 0;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/20'
                    : 'text-white/55 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? 'text-brand-gold' : ''} />
                  <span className="flex-1">{label}</span>
                  {badgeCount > 0 && (
                    <motion.span
                      key={badgeCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1"
                    >
                      {badgeCount}
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
          id="admin-logout"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );


  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 h-screen sticky top-0"
        style={{ background: 'var(--green-dark)', borderRight: '1px solid rgba(201,168,76,0.1)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
              style={{ background: 'var(--green-dark)', borderRight: '1px solid rgba(201,168,76,0.1)' }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
