import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Volume2,
  VolumeX,
  X,
  ShoppingBag,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { formatPrice, timeAgo, statusConfig } from '../../utils/formatters';

export default function NotificationDropdown({ open, onClose }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    soundEnabled,
    toggleSound,
    setActiveOrderId,
    browserPermission,
    requestBrowserNotificationPermission,
  } = useOrders();

  // Close on outside click or ESC key
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.orderId) {
      setActiveOrderId(notif.orderId);
      navigate('/admin/orders');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute right-0 top-full mt-2 w-[340px] sm:w-[400px] max-w-[calc(100vw-24px)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 z-50 overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(180deg, #16211a 0%, #111815 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                <Bell size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-brand-gold text-surface text-[10px] font-black px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-white/50 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Real-time live updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Sound toggle */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute chime' : 'Enable chime'}
                className={`p-1.5 rounded-lg border transition-colors ${
                  soundEnabled
                    ? 'text-brand-gold bg-brand-gold/15 border-brand-gold/30 hover:bg-brand-gold/25'
                    : 'text-white/40 bg-white/5 border-white/10 hover:text-white'
                }`}
                aria-label="Toggle notification sound"
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>

              {/* Mark all as read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  title="Mark all as read"
                  className="p-1.5 rounded-lg text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  aria-label="Mark all notifications as read"
                >
                  <CheckCheck size={14} />
                </button>
              )}

              {/* Close */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
                aria-label="Close notification panel"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Browser notification prompt if not yet allowed */}
          {browserPermission === 'default' && (
            <div className="bg-[#00a693]/15 border-b border-[#00a693]/30 px-3.5 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-white/90 min-w-0">
                <Sparkles size={14} className="text-[#00a693] flex-shrink-0" />
                <span className="truncate text-[11px]">Enable desktop alerts for background tabs</span>
              </div>
              <button
                onClick={requestBrowserNotificationPermission}
                className="text-[10px] font-bold bg-[#00a693] hover:bg-[#008b7a] text-white px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
              >
                Enable
              </button>
            </div>
          )}

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white/30 mb-3">
                  <Bell size={22} />
                </div>
                <p className="text-sm font-semibold text-white/80">No New Notifications</p>
                <p className="text-xs text-white/40 mt-1 max-w-[240px] mx-auto">
                  New customer orders will appear here automatically in real time.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const order = notif.order || {};
                const items = order.items || [];
                const cfg = statusConfig[order.status] || { label: 'Received', color: '#4ade80' };

                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full p-3.5 text-left transition-all flex items-start gap-3 hover:bg-white/[0.04] group relative ${
                      !notif.isRead ? 'bg-[#00a693]/[0.08]' : ''
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {!notif.isRead && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#00a693] rounded-r" />
                    )}

                    {/* Order icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                      !notif.isRead
                        ? 'bg-[#00a693]/20 border-[#00a693]/40 text-[#00a693]'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}>
                      <ShoppingBag size={16} />
                    </div>

                    {/* Order summary info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold text-white truncate">
                            {order.id || 'Order'}
                          </span>
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00a693] flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-white/40 flex items-center gap-1 flex-shrink-0">
                          <Clock size={10} />
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>

                      {/* Customer Name */}
                      <p className="text-xs text-brand-gold font-medium truncate">
                        {order.customer?.name || 'Walk-in Customer'}
                        {order.customer?.phone ? ` • ${order.customer.phone}` : ''}
                      </p>

                      {/* Items breakdown */}
                      <p className="text-[11px] text-white/70 line-clamp-2 mt-0.5">
                        {items.length > 0
                          ? items.map(i => `${i.quantity}× ${i.name}`).join(', ')
                          : 'Order details available'}
                      </p>

                      {/* Price and Status row */}
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[11px]">
                        <span className="font-bold text-white">
                          {formatPrice(order.total || 0)}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color: cfg.color,
                            backgroundColor: `${cfg.color}18`,
                            border: `1px solid ${cfg.color}33`,
                          }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 border-t border-white/10 bg-black/20 flex items-center justify-between text-xs">
              <button
                onClick={clearNotifications}
                className="text-[11px] text-white/40 hover:text-red-400 transition-colors px-2 py-1"
              >
                Clear all
              </button>
              <button
                onClick={() => {
                  navigate('/admin/orders');
                  onClose();
                }}
                className="text-[11px] font-semibold text-brand-gold hover:text-brand-gold-light flex items-center gap-1 transition-colors px-2 py-1"
              >
                View all orders <ExternalLink size={12} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
