import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, ChefHat, Package, Bike, Star, RotateCcw, Phone } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { formatPrice, formatTime, timeAgo } from '../../utils/formatters';

const STATUS_STEPS = [
  { key: 'received',   label: 'Order Received',   icon: CheckCircle, desc: 'We got your order!'              },
  { key: 'preparing',  label: 'Preparing',         icon: ChefHat,     desc: 'Our chefs are cooking for you'   },
  { key: 'ready',      label: 'Ready',             icon: Package,     desc: 'Your order is packed & ready'    },
  { key: 'on_the_way', label: 'On the Way',        icon: Bike,        desc: 'Your order is heading to you'    },
  { key: 'delivered',  label: 'Delivered',         icon: Star,        desc: 'Enjoy your royal meal! 👑'       },
];

const STATUS_ORDER = ['received', 'preparing', 'ready', 'on_the_way', 'delivered'];

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, orders } = useOrders();
  const [order, setOrder] = useState(null);
  const [inputId, setInputId] = useState(orderId || '');
  const [searchId, setSearchId] = useState(orderId || '');
  const [notFound, setNotFound] = useState(false);

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
    setSearchId(inputId.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10"
        >
          <span className="section-tag">Live Status</span>
          <h1 className="section-title">Track Your Order</h1>
          <p className="section-subtitle mx-auto text-center mt-2">Enter your order ID to see real-time status.</p>
        </motion.div>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="flex gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="e.g. ORD-AB12CD34"
            value={inputId}
            onChange={e => setInputId(e.target.value.toUpperCase())}
            className="input-field flex-1"
            id="order-id-input"
          />
          <button type="submit" className="btn-gold px-5 py-3 text-sm">
            <RotateCcw size={15} /> Track
          </button>
        </motion.form>

        {/* Not found */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-white/60">Order not found. Please check your order ID and try again.</p>
          </motion.div>
        )}

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Order Info Card */}
            <div className="glass-card p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/45 text-xs">Order ID</p>
                  <p className="font-brand text-xl text-brand-gold">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/45 text-xs">Placed</p>
                  <p className="text-white text-sm font-medium">{timeAgo(order.createdAt)}</p>
                </div>
              </div>

              {/* Cancelled state */}
              {order.status === 'cancelled' && (
                <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 mb-4">
                  <p className="text-red-400 font-semibold text-sm">❌ Order Cancelled</p>
                  {order.statusHistory?.find(h => h.status === 'cancelled')?.note && (
                    <p className="text-red-400/70 text-xs mt-1">
                      Reason: {order.statusHistory.find(h => h.status === 'cancelled').note}
                    </p>
                  )}
                </div>
              )}

              {/* Progress Steps */}
              {order.status !== 'cancelled' && (
                <div className="mt-2">
                  {STATUS_STEPS.map((step, i) => {
                    const isDone    = i < currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={isCurrent ? { scale: 0.8 } : {}}
                            animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isDone    ? 'bg-green-500/20 border-2 border-green-500' :
                              isCurrent ? 'bg-brand-gold/20 border-2 border-brand-gold animate-pulse-gold' :
                                          'bg-white/5 border-2 border-white/10'
                            }`}
                          >
                            <Icon
                              size={16}
                              className={isDone ? 'text-green-400' : isCurrent ? 'text-brand-gold' : 'text-white/20'}
                            />
                          </motion.div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`w-0.5 h-8 my-1 transition-colors ${isDone ? 'bg-green-500/40' : 'bg-white/8'}`} />
                          )}
                        </div>
                        <div className="pb-6 pt-1.5">
                          <p className={`text-sm font-semibold ${isDone ? 'text-green-400' : isCurrent ? 'text-brand-gold' : 'text-white/30'}`}>
                            {step.label}
                            {isCurrent && <span className="ml-2 text-xs font-normal opacity-60">(Current)</span>}
                          </p>
                          {(isDone || isCurrent) && (
                            <p className="text-xs text-white/40 mt-0.5">{step.desc}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white text-sm mb-3">Delivery Details</h3>
              <div className="space-y-2 text-sm text-white/55">
                <p><span className="text-white/35">Name: </span>{order.customer?.name}</p>
                <p><span className="text-white/35">Phone: </span>{order.customer?.phone}</p>
                <p><span className="text-white/35">Address: </span>{order.customer?.address}</p>
                {order.customer?.notes && (
                  <p><span className="text-white/35">Notes: </span>{order.customer.notes}</p>
                )}
              </div>
              <div className="gold-divider my-3" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/55">Total Paid</span>
                <span className="price-current">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1.5">
                <span className="text-white/55">Estimated Time</span>
                <span className="flex items-center gap-1 text-white">
                  <Clock size={13} className="text-brand-gold" />
                  {order.status === 'delivered' ? 'Delivered' : `~${order.estimatedTime} min`}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white text-sm mb-3">Items Ordered ({order.items?.length})</h3>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-white/60">
                    <span>{item.name} <span className="text-white/35">({item.size})</span> × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/menu" className="btn-outline-gold flex-1 justify-center text-sm">
                Order Again
              </Link>
              <a
                href={`tel:${order.customer?.phone}`}
                className="btn-green flex items-center gap-2 flex-shrink-0 text-sm px-4"
              >
                <Phone size={14} /> Call
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
