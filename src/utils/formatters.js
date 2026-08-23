// Format PKR currency
export const formatPrice = (amount) =>
  `PKR ${Number(amount).toLocaleString('en-PK')}`;

// Format date/time
export const formatDateTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('en-PK', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

export const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Relative time (e.g. "2 min ago")
export const timeAgo = (iso) => {
  const secs = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
};

// Discount percentage
export const calcDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
};

// Truncate text
export const truncate = (str, n = 80) =>
  str.length > n ? str.slice(0, n - 1) + '…' : str;

// Status label map
export const statusConfig = {
  received:   { label: 'Order Received',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  badgeClass: 'badge-delivered' },
  preparing:  { label: 'Preparing',        color: '#f97316', bg: 'rgba(249,115,22,0.12)', badgeClass: 'badge-preparing' },
  ready:      { label: 'Ready',            color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', badgeClass: 'badge-ready'     },
  on_the_way: { label: 'On the Way',       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)',badgeClass: 'badge-delivery'  },
  delivered:  { label: 'Delivered',        color: '#4ade80', bg: 'rgba(74,222,128,0.12)', badgeClass: 'badge-delivered' },
  cancelled:  { label: 'Cancelled',        color: '#f87171', bg: 'rgba(248,113,113,0.12)',badgeClass: 'badge-cancelled' },
};
