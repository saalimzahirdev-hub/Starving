import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';

const OrderContext = createContext(null);

// Web Audio API chime for live order alerts (zero external audio dependency)
const playOrderChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 royal chime
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + index * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.12);
      osc.stop(ctx.currentTime + index * 0.12 + 0.45);
    });
  } catch {
    // Audio context may be restricted before user gesture
  }
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => orderService.getAll());
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  // Poll for updates every 4 seconds + listen for custom events + broadcast channel + storage
  useEffect(() => {
    const refresh = () => setOrders(orderService.getAll());

    const handleNewOrder = (e) => {
      refresh();
      const order = e?.detail;
      if (order && window.location.pathname.startsWith('/admin')) {
        playOrderChime();
        setNewOrderAlert(order);
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-[#122b1e] border-2 border-brand-gold shadow-[0_0_30px_rgba(201,168,76,0.4)] rounded-2xl pointer-events-auto flex p-4`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                    🔔 New Order Received!
                  </p>
                </div>
                <p className="font-brand text-lg text-white font-bold">
                  {order.id} • {order.customer?.name || 'Customer'}
                </p>
                <p className="text-xs text-white/70">
                  {order.items?.length} item(s) • Total: <strong className="text-brand-gold">PKR {order.total}</strong>
                </p>
              </div>
            </div>
          ),
          { duration: 6000, position: 'top-right' }
        );
      }
    };

    const handleUpdated = () => refresh();

    const handleStorageChange = (e) => {
      if (e.key === 'starving_orders' || e.key === 'starving_settings') {
        refresh();
      }
    };

    window.addEventListener('starving:new_order', handleNewOrder);
    window.addEventListener('starving:order_updated', handleUpdated);
    window.addEventListener('starving:settings_updated', refresh);
    window.addEventListener('storage', handleStorageChange);

    // Cross-tab BroadcastChannel listener
    let channel = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('starving_orders_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_ORDER') {
            handleNewOrder({ detail: event.data.order });
          } else if (event.data?.type === 'ORDER_UPDATED') {
            refresh();
          }
        };
      }
    } catch {
      // BroadcastChannel unavailable
    }

    const interval = setInterval(refresh, 4000);
    return () => {
      window.removeEventListener('starving:new_order', handleNewOrder);
      window.removeEventListener('starving:order_updated', handleUpdated);
      window.removeEventListener('starving:settings_updated', refresh);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
      clearInterval(interval);
    };
  }, []);

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
      setActiveOrderId,
      placeOrder,
      updateOrderStatus,
      updatePaymentStatus,
      cancelOrder,
      getOrderById,
      playOrderChime,
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
