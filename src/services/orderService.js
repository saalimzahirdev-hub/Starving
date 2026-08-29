// ============================================================
// Order Service — Central Restaurant Orders Database
// Synchronizes ALL orders across Staff/Owner Admin Dashboards
// and scopes customer order history by customerId
// ============================================================

const uuidv4 = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const ORDERS_KEY = 'starving_orders';

let orderChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    orderChannel = new BroadcastChannel('starving_orders_channel');
  }
} catch {
  // BroadcastChannel fallback
}

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const save = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const ORDER_STATUSES = [
  { key: 'received',    label: 'Order Received',        icon: '🔔',  color: '#4ade80' },
  { key: 'preparing',   label: 'Preparing',             icon: '👨‍🍳', color: '#f97316' },
  { key: 'ready',       label: 'Ready for Pickup',      icon: '📦', color: '#60a5fa' },
  { key: 'on_the_way',  label: 'On the Way',            icon: '🛵', color: '#a78bfa' },
  { key: 'delivered',   label: 'Delivered',             icon: '✅',  color: '#4ade80' },
  { key: 'cancelled',   label: 'Cancelled',             icon: '❌',  color: '#f87171' },
];

export const orderService = {
  // Central retrieval: returns ALL orders from ALL customers for Staff & Owner Dashboard
  getAll: () => [...load()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

  // Customer retrieval: returns ONLY orders belonging to the specified customerId
  getCustomerOrders: (customerId) => {
    if (!customerId) return [];
    return load()
      .filter((o) => o.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById: (id) => load().find((o) => o.id === id) || null,

  getByStatus: (status) => {
    if (status === 'all') return orderService.getAll();
    return load().filter((o) => o.status === status);
  },

  create: (orderData) => {
    const orders = load();
    const orderId = 'ORD-' + (orderData.id ? orderData.id : uuidv4().slice(0, 8).toUpperCase());
    const order = {
      ...orderData,
      id: orderId,
      customerId: orderData.customerId || 'CUST-GUEST',
      status: 'received',
      statusHistory: [{ status: 'received', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      estimatedTime: orderData.estimatedTime || 30, // minutes
    };
    orders.unshift(order);
    save(orders);

    // 1. Dispatch custom in-memory event for real-time local listening
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('starving:new_order', { detail: order }));
    }

    // 2. Broadcast across tabs/windows to update Staff/Owner dashboards instantly
    if (orderChannel) {
      try {
        orderChannel.postMessage({ type: 'NEW_ORDER', order });
      } catch (err) {
        console.warn('BroadcastChannel postMessage failed', err);
      }
    }

    return order;
  },

  updateStatus: (id, newStatus, note = '') => {
    const orders = load();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    orders[idx].status = newStatus;
    orders[idx].statusHistory = [
      ...(orders[idx].statusHistory || []),
      { status: newStatus, note, timestamp: new Date().toISOString() },
    ];
    if (newStatus === 'delivered') {
      orders[idx].deliveredAt = new Date().toISOString();
    }
    save(orders);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('starving:order_updated', { detail: orders[idx] }));
    }
    if (orderChannel) {
      try {
        orderChannel.postMessage({ type: 'ORDER_UPDATED', order: orders[idx] });
      } catch (err) {}
    }

    return orders[idx];
  },

  cancel: (id, reason = '') => {
    return orderService.updateStatus(id, 'cancelled', reason);
  },

  updatePaymentStatus: (id, paymentStatus) => {
    const orders = load();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    orders[idx].paymentStatus = paymentStatus;
    save(orders);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('starving:order_updated', { detail: orders[idx] }));
    }
    if (orderChannel) {
      try {
        orderChannel.postMessage({ type: 'ORDER_UPDATED', order: orders[idx] });
      } catch (err) {}
    }
    return orders[idx];
  },

  getTodayStats: () => {
    const orders = load();
    const today = new Date().toDateString();
    const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
    const revenue = todayOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const pending = todayOrders.filter((o) =>
      ['received', 'preparing', 'ready', 'on_the_way'].includes(o.status)
    ).length;
    const completed = todayOrders.filter((o) => o.status === 'delivered').length;
    return { total: todayOrders.length, revenue, pending, completed };
  },

  getWeeklyRevenue: () => {
    const orders = load();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toDateString();
    });
    return days.map((day) => {
      const dayOrders = orders.filter(
        (o) => new Date(o.createdAt).toDateString() === day && o.status !== 'cancelled'
      );
      const label = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: label,
        revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        orders: dayOrders.length,
      };
    });
  },

  getTopItems: () => {
    const orders = load().filter((o) => o.status !== 'cancelled');
    const itemMap = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.name;
        if (!itemMap[key]) itemMap[key] = { name: key, count: 0, revenue: 0 };
        itemMap[key].count += item.quantity || 1;
        itemMap[key].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });
    return Object.values(itemMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },
};
