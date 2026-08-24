// ============================================================
// Order Service — Create, Read, Update with localStorage
// Real-time synchronization across Customer & Admin Dashboard
// ============================================================

const uuidv4 = () => crypto.randomUUID();

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
  { key: 'received',    label: 'Order Received',        icon: '✓',  color: '#4ade80' },
  { key: 'preparing',   label: 'Preparing',             icon: '🍳', color: '#f97316' },
  { key: 'ready',       label: 'Ready for Pickup',      icon: '📦', color: '#60a5fa' },
  { key: 'on_the_way',  label: 'On the Way',            icon: '🛵', color: '#a78bfa' },
  { key: 'delivered',   label: 'Delivered',             icon: '✓',  color: '#4ade80' },
  { key: 'cancelled',   label: 'Cancelled',             icon: '✕',  color: '#f87171' },
];

export const orderService = {
  getAll: () => [...load()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

  getById: (id) => load().find(o => o.id === id) || null,

  getByStatus: (status) => {
    if (status === 'all') return orderService.getAll();
    return load().filter(o => o.status === status);
  },

  create: (orderData) => {
    const orders = load();
    const order = {
      id: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
      ...orderData,
      status: 'received',
      statusHistory: [{ status: 'received', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      estimatedTime: orderData.estimatedTime || 30, // minutes
    };
    orders.unshift(order);
    save(orders);

    // 1. Dispatch custom in-memory event
    window.dispatchEvent(new CustomEvent('starving:new_order', { detail: order }));

    // 2. Broadcast across tabs and windows
    if (orderChannel) {
      orderChannel.postMessage({ type: 'NEW_ORDER', order });
    }

    return order;
  },

  updateStatus: (id, newStatus, note = '') => {
    const orders = load();
    const idx = orders.findIndex(o => o.id === id);
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

    window.dispatchEvent(new CustomEvent('starving:order_updated', { detail: orders[idx] }));
    if (orderChannel) {
      orderChannel.postMessage({ type: 'ORDER_UPDATED', order: orders[idx] });
    }

    return orders[idx];
  },

  cancel: (id, reason = '') => {
    return orderService.updateStatus(id, 'cancelled', reason);
  },

  getTodayStats: () => {
    const orders = load();
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const revenue = todayOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const pending = todayOrders.filter(o =>
      ['received', 'preparing', 'ready', 'on_the_way'].includes(o.status)).length;
    const completed = todayOrders.filter(o => o.status === 'delivered').length;
    return { total: todayOrders.length, revenue, pending, completed };
  },

  getWeeklyRevenue: () => {
    const orders = load();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toDateString();
    });
    return days.map(day => {
      const dayOrders = orders.filter(o =>
        new Date(o.createdAt).toDateString() === day && o.status !== 'cancelled'
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
    const orders = load().filter(o => o.status !== 'cancelled');
    const itemMap = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
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
