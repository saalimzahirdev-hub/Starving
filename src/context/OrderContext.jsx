import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { orderService } from '../services/orderService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

const OrderContext = createContext(null);

const NOTIFICATIONS_STORAGE_KEY = 'starving_admin_notifications';
const SOUND_STORAGE_KEY = 'starving_sound_enabled';

// Play sound chime with web audio fallback
export const playOrderChime = () => {
  try {
    const audio = new Audio('/sounds/order-bell.mp3');
    audio.volume = 0.9;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback Web Audio API Synthesizer
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const now = ctx.currentTime;
            
            // Bell chime note 1
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(880, now); // A5
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.8);

            // Bell chime note 2
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1320, now + 0.15); // E6
            gain2.gain.setValueAtTime(0.35, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.15);
            osc2.stop(now + 1.0);
          }
        } catch (e) {}
      });
    }
  } catch (err) {}
};

export function OrderProvider({ children }) {
  const { customerId, isAuthenticated, isStaff } = useAuth();
  
  // All restaurant orders (used by staff/owner dashboard)
  const [orders, setOrders] = useState(() => orderService.getAll());
  
  // Scoped orders for active customer
  const [customerOrders, setCustomerOrders] = useState(() => 
    orderService.getCustomerOrders(customerId)
  );

  const [activeOrderId, setActiveOrderId] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  // Load notifications from sessionStorage
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = sessionStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [browserPermission, setBrowserPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const handledOrderIdsRef = useRef(new Set());
  const isInitializedRef = useRef(false);

  // Save notifications to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Keep customer orders synchronized with active customerId
  useEffect(() => {
    if (customerId) {
      setCustomerOrders(orderService.getCustomerOrders(customerId));
    }
  }, [customerId, orders]);

  // Request browser notification permission
  const requestBrowserNotificationPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    try {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      return perm;
    } catch {
      return 'denied';
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(next));
      if (next) playOrderChime();
      return next;
    });
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    try {
      sessionStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    } catch {}
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Process incoming new order event
  const processIncomingOrder = useCallback(
    (order) => {
      if (!order?.id) return;
      if (handledOrderIdsRef.current.has(order.id)) return;
      handledOrderIdsRef.current.add(order.id);

      // Update central orders state
      setOrders(orderService.getAll());

      // If matches active customer, update customerOrders
      if (customerId && order.customerId === customerId) {
        setCustomerOrders(orderService.getCustomerOrders(customerId));
      }

      // Add to notifications list
      const notif = {
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        orderId: order.id,
        customerName: order.customer?.name || 'Customer',
        total: order.total,
        itemCount: (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
        itemsSummary: (order.items || []).map((i) => `${i.quantity || 1}x ${i.name}`).slice(0, 2).join(', '),
        createdAt: order.createdAt || new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [notif, ...prev.slice(0, 49)]);
      setNewOrderAlert(order);

      // Play bell chime if sound enabled and user is staff/owner or on admin route
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      if (soundEnabled) {
        playOrderChime();
      }

      // Trigger Browser Notification if permission granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const itemsText = (order.items || [])
            .map((i) => `${i.quantity}x ${i.name}`)
            .slice(0, 3)
            .join(', ');
          const n = new Notification('🔔 New Restaurant Order Received!', {
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
        } catch {}
      }

      // Show toast on admin views
      if (isAdminRoute) {
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
                  {(order.items || []).map((i) => `${i.quantity}x ${i.name}`).join(', ') || 'Item details'}
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
    },
    [soundEnabled, customerId]
  );

  // Set up listeners for real-time order detection
  useEffect(() => {
    const initialOrders = orderService.getAll();
    initialOrders.forEach((o) => {
      if (o?.id) handledOrderIdsRef.current.add(o.id);
    });
    isInitializedRef.current = true;

    const refresh = () => {
      setOrders(orderService.getAll());
      if (customerId) {
        setCustomerOrders(orderService.getCustomerOrders(customerId));
      }
    };

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
        currentList.forEach((order) => {
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
    } catch {}

    // Periodic safety sync every 5 seconds
    const interval = setInterval(() => {
      const all = orderService.getAll();
      all.forEach((order) => {
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
  }, [processIncomingOrder, customerId]);

  const placeOrder = useCallback(
    (orderData) => {
      const orderPayload = {
        ...orderData,
        customerId: orderData.customerId || customerId || 'CUST-GUEST',
      };
      const order = orderService.create(orderPayload);
      setOrders(orderService.getAll());
      setCustomerOrders(orderService.getCustomerOrders(orderPayload.customerId));
      setActiveOrderId(order.id);
      return order;
    },
    [customerId]
  );

  const updateOrderStatus = useCallback((id, status, note = '') => {
    const updated = orderService.updateStatus(id, status, note);
    setOrders(orderService.getAll());
    if (customerId) {
      setCustomerOrders(orderService.getCustomerOrders(customerId));
    }
    return updated;
  }, [customerId]);

  const cancelOrder = useCallback((id, reason = '') => {
    const updated = orderService.cancel(id, reason);
    setOrders(orderService.getAll());
    if (customerId) {
      setCustomerOrders(orderService.getCustomerOrders(customerId));
    }
    return updated;
  }, [customerId]);

  const updatePaymentStatus = useCallback((id, paymentStatus) => {
    const updated = orderService.updatePaymentStatus(id, paymentStatus);
    setOrders(orderService.getAll());
    return updated;
  }, []);

  const getOrderById = useCallback(
    (id) => {
      return orders.find((o) => o.id === id) || orderService.getById(id);
    },
    [orders]
  );

  const activeOrder = activeOrderId ? getOrderById(activeOrderId) : null;

  return (
    <OrderContext.Provider
      value={{
        orders,
        customerOrders,
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
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
