import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

const OrderContext = createContext(null);

const NOTIFICATIONS_STORAGE_KEY = 'starving_admin_notifications';
const SOUND_STORAGE_KEY = 'starving_admin_sound';

// Web Audio API chime for live order alerts (zero external audio dependencies, pleasant restaurant chime)
let sharedAudioCtx = null;
const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
};

const playOrderChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Harmonic bell sequence: E5 (659.25Hz), G#5 (830.61Hz), B5 (987.77Hz), E6 (1318.51Hz)
    const notes = [659.25, 830.61, 987.77, 1318.51];
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.1);

      gain.gain.setValueAtTime(0, startTime + index * 0.1);
      gain.gain.linearRampToValueAtTime(0.28, startTime + index * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + index * 0.1 + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + index * 0.1);
      osc.stop(startTime + index * 0.1 + 0.6);
    });
  } catch {
    // Audio context may be restricted before user gesture
  }
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => orderService.getAll());
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  // Sound preference state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem(SOUND_STORAGE_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  // Browser notification permission state
  const [browserPermission, setBrowserPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // Notifications list state
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = sessionStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep track of order IDs already processed in this active session to prevent duplicates
  const handledOrderIdsRef = useRef(new Set());
  const isInitializedRef = useRef(false);

  // Save notifications to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // Storage limits or quota fallback
    }
  }, [notifications]);

  // Unlock Web Audio on first user interaction anywhere in the document
  useEffect(() => {
    const unlockAudio = () => {
      getAudioContext();
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Request browser notification permission
  const requestBrowserNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setBrowserPermission(res);
        if (res === 'granted') {
          toast.success('Desktop notifications enabled!', {
            style: { background: '#16211a', color: '#e8f0ec', border: '1px solid #00a693' }
          });
        }
        return res;
      } catch {
        return 'denied';
      }
    }
    return 'unsupported';
  }, []);

  // Toggle sound alert
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {}
      if (next) {
        playOrderChime();
        toast('🔔 Notification sound turned ON', {
          style: { background: '#16211a', color: '#e8f0ec', border: '1px solid #00a693' }
        });
      } else {
        toast('🔕 Notification sound MUTED', {
          style: { background: '#16211a', color: '#e8f0ec', border: '1px solid rgba(255,255,255,0.2)' }
        });
      }
      return next;
    });
  }, []);

  // Mark specific notification as read
  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Process incoming new order event
  const processIncomingOrder = useCallback((order) => {
    if (!order || !order.id) return;

    // Refresh orders list
    setOrders(orderService.getAll());

    // If order was already handled during this session, skip alert triggers
    if (handledOrderIdsRef.current.has(order.id)) {
      return;
    }
    handledOrderIdsRef.current.add(order.id);

    // Create notification item
    const notifItem = {
      id: `notif-${order.id}`,
      orderId: order.id,
      order,
      isRead: false,
      createdAt: order.createdAt || new Date().toISOString(),
    };

    setNotifications(prev => [notifItem, ...prev.filter(n => n.orderId !== order.id)]);
    setNewOrderAlert(order);

    // Play chime if sound enabled
    if (soundEnabled) {
      playOrderChime();
    }

    // Trigger Browser Notification if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const itemsText = (order.items || [])
          .map(i => `${i.quantity}× ${i.name}`)
          .slice(0, 3)
          .join(', ');
        const n = new Notification('🔔 New Order Received!', {
          body: `Order #${order.id}\n${order.customer?.name || 'Customer'}: ${itemsText}\nTotal: PKR ${order.total}`,
          icon: '/favicon.ico',
          tag: order.id,
        });
        n.onclick = () => {
          window.focus();
          setActiveOrderId(order.id);
          if (!window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/orders';
          }
        };
      } catch {
        // Notification failed or blocked
      }
    }

    // Show rich in-dashboard toast
    const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    if (isAdmin) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-[#111815] border border-brand-gold/50 shadow-[0_12px_40px_rgba(0,0,0,0.8)] rounded-2xl pointer-events-auto p-4 flex items-start gap-3.5`}
            style={{ backdropFilter: 'blur(20px)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Bell size={20} className="animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00a693] animate-ping" />
                  New Order Received
                </span>
                <span className="text-[10px] text-white/40">Just now</span>
              </div>

              <p className="font-brand text-sm sm:text-base text-white font-bold truncate">
                {order.id} • {order.customer?.name || 'Customer'}
              </p>

              <p className="text-xs text-white/70 truncate mt-0.5">
                {(order.items || []).map(i => `${i.quantity}× ${i.name}`).join(', ') || 'Item details'}
              </p>

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10">
                <span className="text-xs text-white/70">
                  Total: <strong className="text-brand-gold font-bold">PKR {order.total}</strong>
                </span>

                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    setActiveOrderId(order.id);
                    if (window.location.pathname !== '/admin/orders') {
                      window.location.href = '/admin/orders';
                    }
                  }}
                  className="text-xs font-bold text-[#00a693] hover:text-[#1ab69d] flex items-center gap-1 transition-colors"
                >
                  View Order →
                </button>
              </div>
            </div>
          </div>
        ),
        { duration: 7000, position: 'top-right' }
      );
    }
  }, [soundEnabled]);

  // Set up listeners for real-time order detection
  useEffect(() => {
    // 1. Initial load: Mark all pre-existing orders as already handled so they DO NOT fire alerts
    const initialOrders = orderService.getAll();
    initialOrders.forEach(o => {
      if (o?.id) handledOrderIdsRef.current.add(o.id);
    });
    isInitializedRef.current = true;

    const refresh = () => setOrders(orderService.getAll());

    const handleNewOrderEvent = (e) => {
      const order = e?.detail;
      if (order) {
        processIncomingOrder(order);
      } else {
        refresh();
      }
    };

    const handleUpdated = () => refresh();

    const handleStorageChange = (e) => {
      if (e.key === 'starving_orders') {
        const currentList = orderService.getAll();
        // Detect if any new order appeared in storage
        currentList.forEach(order => {
          if (order?.id && !handledOrderIdsRef.current.has(order.id)) {
            processIncomingOrder(order);
          }
        });
        refresh();
      } else if (e.key === 'starving_settings') {
        refresh();
      }
    };

    window.addEventListener('starving:new_order', handleNewOrderEvent);
    window.addEventListener('starving:order_updated', handleUpdated);
    window.addEventListener('starving:settings_updated', refresh);
    window.addEventListener('storage', handleStorageChange);

    // Cross-tab BroadcastChannel listener
    let channel = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('starving_orders_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_ORDER' && event.data.order) {
            processIncomingOrder(event.data.order);
          } else if (event.data?.type === 'ORDER_UPDATED') {
            refresh();
          }
        };
      }
    } catch {
      // BroadcastChannel unavailable
    }

    // Safety periodic check every 5 seconds for any new order missed during background suspension
    const interval = setInterval(() => {
      const all = orderService.getAll();
      all.forEach(order => {
        if (order?.id && !handledOrderIdsRef.current.has(order.id) && isInitializedRef.current) {
          processIncomingOrder(order);
        }
      });
      refresh();
    }, 5000);

    return () => {
      window.removeEventListener('starving:new_order', handleNewOrderEvent);
      window.removeEventListener('starving:order_updated', handleUpdated);
      window.removeEventListener('starving:settings_updated', refresh);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
      clearInterval(interval);
    };
  }, [processIncomingOrder]);

  const placeOrder = useCallback((orderData) => {
    const order = orderService.create(orderData);
    setOrders(orderService.getAll());
    setActiveOrderId(order.id);
    return order;
  }, []);

  const updateOrderStatus = useCallback((id, status, note = '') => {
    const updated = orderService.updateStatus(id, status, note);
    setOrders(orderService.getAll());
    return updated;
  }, []);

  const cancelOrder = useCallback((id, reason = '') => {
    const updated = orderService.cancel(id, reason);
    setOrders(orderService.getAll());
    return updated;
  }, []);

  const updatePaymentStatus = useCallback((id, paymentStatus) => {
    const updated = orderService.updatePaymentStatus(id, paymentStatus);
    setOrders(orderService.getAll());
    return updated;
  }, []);

  const getOrderById = useCallback((id) => {
    return orders.find(o => o.id === id) || orderService.getById(id);
  }, [orders]);

  const activeOrder = activeOrderId ? getOrderById(activeOrderId) : null;

  return (
    <OrderContext.Provider value={{
      orders,
      activeOrder,
      activeOrderId,
      newOrderAlert,
      notifications,
      unreadCount,
      soundEnabled,
      browserPermission,
      setActiveOrderId,
      placeOrder,
      updateOrderStatus,
      updatePaymentStatus,
      cancelOrder,
      getOrderById,
      playOrderChime,
      toggleSound,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotifications,
      requestBrowserNotificationPermission,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
