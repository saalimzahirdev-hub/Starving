import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => orderService.getAll());
  const [activeOrderId, setActiveOrderId] = useState(null);

  // Poll for updates every 5 seconds + listen for custom events + cross-tab storage updates
  useEffect(() => {
    const refresh = () => setOrders(orderService.getAll());

    const handleNewOrder = () => refresh();
    const handleUpdated  = () => refresh();
    const handleStorageChange = (e) => {
      if (e.key === 'starving_orders' || e.key === 'starving_settings') {
        refresh();
      }
    };

    window.addEventListener('starving:new_order',      handleNewOrder);
    window.addEventListener('starving:order_updated',  handleUpdated);
    window.addEventListener('starving:settings_updated', refresh);
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener('starving:new_order',      handleNewOrder);
      window.removeEventListener('starving:order_updated',  handleUpdated);
      window.removeEventListener('starving:settings_updated', refresh);
      window.removeEventListener('storage', handleStorageChange);
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

  const getOrderById = useCallback((id) => {
    return orders.find(o => o.id === id) || orderService.getById(id);
  }, [orders]);

  const activeOrder = activeOrderId ? getOrderById(activeOrderId) : null;

  return (
    <OrderContext.Provider value={{
      orders,
      activeOrder,
      activeOrderId,
      setActiveOrderId,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
      getOrderById,
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
