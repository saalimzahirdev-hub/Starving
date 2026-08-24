import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, ChevronDown, ChevronUp, X, Check, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { formatPrice, formatDateTime, timeAgo, statusConfig } from '../../utils/formatters';

const STATUS_ACTIONS = [
  { from: 'received',   to: 'preparing',  label: 'Start Preparing', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/25' },
  { from: 'preparing',  to: 'ready',      label: 'Mark Ready',      color: 'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25'       },
  { from: 'ready',      to: 'on_the_way', label: 'Out for Delivery', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25' },
  { from: 'on_the_way', to: 'delivered',  label: 'Mark Delivered',  color: 'bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25'    },
];

export default function OrderCard({ order }) {
  const { updateOrderStatus, updatePaymentStatus, cancelOrder } = useOrders();
  const [expanded, setExpanded] = useState(false);
  const [cancelMode, setCancelMode] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const cfg = statusConfig[order.status] || {};
  const nextAction = STATUS_ACTIONS.find(a => a.from === order.status);
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';
  const isActive = !isCancelled && !isDelivered;

  const isJazzCash = order.paymentMethod === 'jazzcash';
  const isEasyPaisa = order.paymentMethod === 'easypaisa';
  const isOnline = isJazzCash || isEasyPaisa;
  const isPaid = order.paymentStatus === 'paid';

  const handleAction = (toStatus) => {
    updateOrderStatus(order.id, toStatus);
  };

  const handleTogglePayment = () => {
    if (updatePaymentStatus) {
      updatePaymentStatus(order.id, isPaid ? 'pending_verification' : 'paid');
    }
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    cancelOrder(order.id, cancelReason);
    setCancelMode(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="glass-card overflow-hidden"
    >
      {/* Header row */}
      <div className="p-4 flex items-start gap-3">
        {/* Status dot */}
        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: cfg.color }} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm">{order.id}</span>
              <span className={`badge ${cfg.badgeClass}`}>{cfg.label}</span>

              {/* Payment Method Badge in Header */}
              {isJazzCash && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                  🟠 JazzCash {order.onlinePaymentDetails?.transactionId && `• TID: ${order.onlinePaymentDetails.transactionId}`}
                </span>
              )}
              {isEasyPaisa && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  🟢 EasyPaisa {order.onlinePaymentDetails?.transactionId && `• TID: ${order.onlinePaymentDetails.transactionId}`}
                </span>
              )}
              {order.paymentMethod === 'cod' && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  💵 COD
                </span>
              )}
            </div>
            <span className="text-white/35 text-xs flex-shrink-0">{timeAgo(order.createdAt)}</span>
          </div>

          <div className="flex items-center gap-4 mt-1">
            <p className="font-medium text-white/80 text-sm truncate">{order.customer?.name}</p>
            <a
              href={`tel:${order.customer?.phone}`}
              className="flex items-center gap-1 text-xs text-brand-gold hover:text-brand-gold/70 transition-colors"
            >
              <Phone size={11} /> {order.customer?.phone}
            </a>
          </div>
          <p className="text-white/40 text-xs mt-0.5 truncate">{order.customer?.address}</p>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="price-current text-sm">{formatPrice(order.total)}</p>
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-white/35 hover:text-white/60 transition-colors mt-1"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-4">
              {/* Online Payment Verification Box */}
              {isOnline && (
                <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isJazzCash ? 'bg-orange-500/10 border-orange-500/30' : 'bg-emerald-500/10 border-emerald-500/30'
                }`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <Smartphone size={15} className={isJazzCash ? 'text-orange-400' : 'text-emerald-400'} />
                      <span className="font-bold text-xs text-white">
                        {isJazzCash ? 'JazzCash Mobile Payment' : 'EasyPaisa Mobile Payment'}
                      </span>
                    </div>
                    <div className="mt-1 space-y-0.5 text-xs">
                      <p className="text-white/80">
                        Transaction ID (TID): <strong className="text-brand-gold font-mono bg-black/40 px-1.5 py-0.5 rounded">{order.onlinePaymentDetails?.transactionId || 'N/A'}</strong>
                      </p>
                      {order.onlinePaymentDetails?.senderPhone && (
                        <p className="text-white/50">Sender Phone: {order.onlinePaymentDetails.senderPhone}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTogglePayment}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-all ${
                      isPaid
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    }`}
                  >
                    <Check size={13} />
                    <span>{isPaid ? 'Payment Verified (Paid)' : 'Mark Payment as Verified'}</span>
                  </button>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-xs text-white/35 font-semibold uppercase tracking-wide mb-2">Items</p>
                <div className="space-y-1">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/70">
                        {item.name}
                        {item.size && <span className="text-white/35 ml-1">({item.size})</span>}
                        {item.addons?.length > 0 && (
                          <span className="text-white/25 ml-1 text-xs">+{item.addons.map(a => a.name).join(', ')}</span>
                        )}
                        <span className="text-white/50 ml-1">×{item.quantity}</span>
                      </span>
                      <span className="text-white/60">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {order.customer?.notes && (
                <div>
                  <p className="text-xs text-white/35 font-semibold uppercase tracking-wide mb-1">Special Instructions</p>
                  <p className="text-sm text-yellow-400/80 bg-yellow-500/5 border border-yellow-500/15 rounded-lg px-3 py-2">
                    {order.customer.notes}
                  </p>
                </div>
              )}

              {/* Summary */}
              <div className="flex gap-4 text-xs text-white/40 flex-wrap items-center">
                <span>💳 {order.paymentMethodLabel || (order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod)}</span>
                <span>🕐 {formatDateTime(order.createdAt)}</span>
                {order.deliveredAt && <span>✅ {formatDateTime(order.deliveredAt)}</span>}
              </div>

              {/* Action Buttons */}
              {isActive && !cancelMode && (
                <div className="flex flex-wrap gap-2">
                  {/* Accept first */}
                  {order.status === 'received' && (
                    <button
                      onClick={() => handleAction('preparing')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25"
                    >
                      ✓ Accept & Prepare
                    </button>
                  )}
                  {/* Next status */}
                  {nextAction && order.status !== 'received' && (
                    <button
                      onClick={() => handleAction(nextAction.to)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${nextAction.color}`}
                    >
                      {nextAction.label}
                    </button>
                  )}
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${order.customer?.phone?.replace(/\D/g,'')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all bg-green-600/15 text-green-400 border-green-600/30 hover:bg-green-600/25"
                  >
                    <MessageCircle size={12} /> WhatsApp
                  </a>
                  {/* Cancel */}
                  <button
                    onClick={() => setCancelMode(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20 ml-auto"
                  >
                    <X size={12} /> Cancel Order
                  </button>
                </div>
              )}

              {/* Cancel reason input */}
              {cancelMode && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Reason for cancellation (required)"
                    className="input-field text-sm"
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={handleCancel} disabled={!cancelReason.trim()} className="btn-red text-xs py-2 px-4 disabled:opacity-40">
                      Confirm Cancel
                    </button>
                    <button onClick={() => setCancelMode(false)} className="btn-outline-gold text-xs py-2 px-4">
                      Keep Order
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
