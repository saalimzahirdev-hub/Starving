import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, ChefHat, Package, Bike, Star, RotateCcw, Phone, ShoppingBag, ShieldCheck, UserCheck } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatTime, timeAgo } from '../../utils/formatters';

const STATUS_STEPS = [
  { key: 'received',   label: 'Order Received',   icon: CheckCircle, desc: 'We got your order!'              },
  { key: 'preparing',  label: 'Preparing',         icon: ChefHat,     desc: 'Our chefs are cooking for you'   },
  { key: 'ready',      label: 'Ready for Pickup',  icon: Package,     desc: 'Your order is packed & ready'    },
  { key: 'on_the_way', label: 'On the Way',        icon: Bike,        desc: 'Your order is heading to you'    },
  { key: 'delivered',  label: 'Delivered',         icon: Star,        desc: 'Enjoy your royal meal! 👑'       },
];

const STATUS_ORDER = ['received', 'preparing', 'ready', 'on_the_way', 'delivered'];

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, orders, customerOrders } = useOrders();
  const { customerId } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [inputId, setInputId] = useState(orderId || '');
  const [searchId, setSearchId] = useState(orderId || '');
  const [notFound, setNotFound] = useState(false);

  // Auto-select latest customer order if no specific ID searched
  useEffect(() => {
    if (!searchId && customerOrders.length > 0) {
      setSearchId(customerOrders[0].id);
      setInputId(customerOrders[0].id);
    }
  }, [customerOrders, searchId]);

  useEffect(() => {
    if (!searchId) return;
    const found = getOrderById(searchId);
    if (found) {
      setOrder(found);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  }, [searchId, orders, getOrderById]);

  const currentStepIndex = order
    ? order.status === 'cancelled'
      ? -1
      : STATUS_ORDER.indexOf(order.status)
    : -1;

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputId.trim()) {
      setSearchId(inputId.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <span className="section-tag">Real-Time Status</span>
          <h1 className="section-title text-3xl sm:text-4xl">Track Your Order</h1>
          <p className="section-subtitle mx-auto text-center mt-2 text-sm">
            View live kitchen preparation and delivery progress for your orders.
          </p>
        </motion.div>

        {/* Customer Account Scope Indicator */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/70">
            <UserCheck size={16} className="text-brand-gold" />
            <span>Customer Session: <strong className="text-brand-gold font-mono">{customerId}</strong></span>
          </div>
          <span className="text-[11px] text-white/40">
            {customerOrders.length} Order{customerOrders.length !== 1 ? 's' : ''} in your history
          </span>
        </div>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="flex gap-3"
        >
          <input
            type="text"
            placeholder="Enter Order ID (e.g. ORD-AB12CD34)"
            value={inputId}
            onChange={(e) => setInputId(e.target.value.toUpperCase())}
            className="input-field flex-1 font-mono uppercase"
            id="order-id-input"
          />
          <button type="submit" className="btn-gold px-6 py-3 text-sm">
            <RotateCcw size={15} /> Track
          </button>
        </motion.form>

        {/* Customer's Own Recent Orders List */}
        {customerOrders.length > 0 && (
          <div className="glass-card p-4">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-brand-gold" /> Your Placed Orders ({customerOrders.length})
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {customerOrders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setInputId(o.id);
                    setSearchId(o.id);
                  }}
                  className={`px-3 py-2 rounded-xl text-left border flex-shrink-0 transition-all ${
                    searchId === o.id
                      ? 'border-brand-gold bg-brand-gold/15 text-brand-gold'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                  }`}
                >
                  <p className="font-mono text-xs font-bold">{o.id}</p>
                  <p className="text-[10px] text-white/40 mt-0.5 truncate max-w-[130px]">
                    {(o.items || []).map((i) => i.name).join(', ')}
                  </p>
                  <p className="text-[10px] text-brand-gold font-semibold mt-1">
                    {formatPrice(o.total)} • <span className="capitalize">{o.status}</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Not found */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-white/70 font-semibold text-sm">Order Not Found</p>
            <p className="text-white/40 text-xs mt-1">
              Please verify the Order ID or select one of your placed orders above.
            </p>
          </motion.div>
        )}

        {/* Order Details View */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Order Info Card */}
            <div className="glass-card p-5 sm:p-6">
              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-white/40 text-xs">Tracking Order</p>
                  <p className="font-brand text-2xl text-brand-gold font-bold">{order.id}</p>
                  <p className="text-white/60 text-xs mt-0.5">Placed for {order.customer?.name || 'Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-xs">Placed</p>
                  <p className="text-white text-sm font-medium">{timeAgo(order.createdAt)}</p>
                  <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-bold uppercase">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Cancelled state */}
              {order.status === 'cancelled' && (
                <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 mb-4">
                  <p className="text-red-400 font-semibold text-sm">❌ Order Cancelled</p>
                  {order.statusHistory?.find((h) => h.status === 'cancelled')?.note && (
                    <p className="text-red-400/70 text-xs mt-1">
                      Reason: {order.statusHistory.find((h) => h.status === 'cancelled').note}
                    </p>
                  )}
                </div>
              )}

              {/* Progress Steps Timeline */}
              {order.status !== 'cancelled' && (
                <div className="mt-4 space-y-4">
                  {STATUS_STEPS.map((step, i) => {
                    const isDone = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isDone
                                ? 'bg-brand-gold/20 border-2 border-brand-gold text-brand-gold'
                                : 'bg-white/5 border-2 border-white/10 text-white/30'
                            } ${isCurrent ? 'animate-pulse' : ''}`}
                          >
                            <Icon size={18} />
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div
                              className={`w-0.5 h-8 my-1 ${
                                i < currentStepIndex ? 'bg-brand-gold' : 'bg-white/10'
                              }`}
                            />
                          )}
                        </div>

                        <div className="pt-1.5 flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${isDone ? 'text-white' : 'text-white/40'}`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-white/40 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Items Summary Card */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white text-sm mb-3">Order Items</h3>
              <div className="space-y-2">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-white/5">
                    <span className="text-white/80">
                      {item.quantity}x {item.name} {item.size && `(${item.size})`}
                    </span>
                    <span className="text-brand-gold font-semibold">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm font-bold pt-2 text-white">
                  <span>Total Amount</span>
                  <span className="text-brand-gold">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
