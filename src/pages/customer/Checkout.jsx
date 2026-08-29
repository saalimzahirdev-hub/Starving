import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Banknote, Smartphone, Copy, Check, MapPin, Phone, User, Crown, Info, PackageCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, subtotal, deliveryFee, promoDiscount, total, appliedPromo, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { customerId } = useAuth();
  const { settings } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [payment, setPayment] = useState('cod'); // 'cod' | 'jazzcash' | 'easypaisa'
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '',
    senderPhone: '',
  });
  const [copiedField, setCopiedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const paymentConfig = settings?.paymentMethods || {
    cod: { enabled: true, label: 'Cash on Delivery (COD)' },
    jazzcash: {
      enabled: true,
      label: 'JazzCash',
      accountNumber: settings?.contactInfo?.whatsapp || '+92 339 666733',
      accountTitle: 'STARVING / Fast Food',
      instructions: 'Transfer the total amount to the JazzCash number above, then enter the Transaction ID (TID) below.',
    },
    easypaisa: {
      enabled: true,
      label: 'EasyPaisa',
      accountNumber: settings?.contactInfo?.whatsapp || '+92 339 666733',
      accountTitle: 'STARVING / Fast Food',
      instructions: 'Transfer the total amount to the EasyPaisa number above, then enter the Transaction ID (TID) below.',
    },
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`, {
      style: { background: '#161e1b', color: '#e8f0ec', border: '1px solid rgba(201,168,76,0.3)' },
    });
    setTimeout(() => setCopiedField(null), 2500);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    if (form.phone && !/^[+\d\s-]{10,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';

    // Online payment validation
    if ((payment === 'jazzcash' || payment === 'easypaisa') && !paymentDetails.transactionId.trim()) {
      e.transactionId = 'Transaction ID (TID) is required for online verification';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const selectedOnlineMethod =
      payment === 'jazzcash' ? 'JazzCash' : payment === 'easypaisa' ? 'EasyPaisa' : 'Cash on Delivery';

    const order = placeOrder({
      customerId: customerId || 'CUST-GUEST',
      customer: form,
      items: items.map((i) => ({
        name: i.name,
        size: i.sizeLabel,
        addons: i.addons,
        price: i.price,
        originalPrice: i.originalPrice,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal,
      deliveryFee,
      promoDiscount,
      appliedPromo,
      total,
      paymentMethod: payment,
      paymentMethodLabel: selectedOnlineMethod,
      paymentStatus: payment === 'cod' ? 'unpaid' : 'pending_verification',
      onlinePaymentDetails:
        payment === 'jazzcash' || payment === 'easypaisa'
          ? {
              accountName: selectedOnlineMethod,
              transactionId: paymentDetails.transactionId.trim(),
              senderPhone: paymentDetails.senderPhone.trim() || form.phone,
              transferredTo:
                payment === 'jazzcash'
                  ? paymentConfig.jazzcash?.accountNumber
                  : paymentConfig.easypaisa?.accountNumber,
            }
          : null,
    });

    clearCart();
    setConfirmed(order);
    setSubmitting(false);
    toast.success('Order placed successfully! Central restaurant kitchen notified.', {
      style: { background: '#161e1b', color: '#e8f0ec', border: '1px solid rgba(201,168,76,0.3)' },
    });
  };

  // Order confirmed screen
  if (confirmed) {
    const isOnline = confirmed.paymentMethod === 'jazzcash' || confirmed.paymentMethod === 'easypaisa';

    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card max-w-lg w-full p-6 sm:p-8 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto text-green-400">
            <CheckCircle size={36} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Order Confirmed</span>
            <h1 className="font-brand text-2xl sm:text-3xl text-white mt-1">Thank you, {confirmed.customer?.name}!</h1>
            <p className="text-white/60 text-sm mt-1">
              Your order has been forwarded to the kitchen.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left space-y-2.5">
            <div className="flex justify-between items-center text-xs text-white/50">
              <span>Order Reference ID</span>
              <span className="font-mono text-brand-gold font-bold text-sm">{confirmed.id}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-white/50">
              <span>Customer Account</span>
              <span className="font-mono text-white/70 text-[11px]">{confirmed.customerId}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-white/50">
              <span>Payment Mode</span>
              <span className="text-white font-medium capitalize">{confirmed.paymentMethodLabel}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-white/50 border-t border-white/10 pt-2 font-bold">
              <span className="text-white">Amount Due</span>
              <span className="text-brand-gold text-base">{formatPrice(confirmed.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/track-order/${confirmed.id}`}
              className="btn-gold flex-1 justify-center text-sm py-3 flex items-center gap-2"
            >
              <PackageCheck size={16} /> Live Track Order
            </Link>
            <Link
              to="/menu"
              className="px-4 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
            >
              Browse Menu
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="section-tag">Complete Purchase</span>
          <h1 className="section-title text-2xl sm:text-3xl">Checkout</h1>
          <p className="text-white/50 text-sm mt-1">Enter your delivery details and choose your payment method.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Customer Info & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Info */}
            <div className="glass-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <User size={18} className="text-brand-gold" />
                <h2 className="font-semibold text-white text-base">Delivery Details</h2>
              </div>

              <div>
                <label className="input-label">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Customer A"
                  className={`input-field ${errors.name ? 'border-red-500/60' : ''}`}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="input-label">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 0300 1234567"
                  className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`}
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="input-label">Delivery Address *</label>
                <textarea
                  rows={3}
                  placeholder="House/Apartment #, Street, Area..."
                  className={`input-field resize-none ${errors.address ? 'border-red-500/60' : ''}`}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="input-label">Order Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Extra ketchup, ring bell, no mayo, etc."
                  className="input-field"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Banknote size={18} className="text-brand-gold" />
                <h2 className="font-semibold text-white text-base">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPayment('cod')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    payment === 'cod'
                      ? 'border-brand-gold bg-brand-gold/15 text-brand-gold'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                  }`}
                >
                  <Banknote size={20} className="mb-2" />
                  <span className="font-semibold text-xs text-white">Cash on Delivery</span>
                  <span className="text-[10px] text-white/40 mt-1">Pay with cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayment('jazzcash')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    payment === 'jazzcash'
                      ? 'border-orange-500 bg-orange-500/15 text-orange-400'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                  }`}
                >
                  <Smartphone size={20} className="mb-2 text-orange-400" />
                  <span className="font-semibold text-xs text-white">JazzCash</span>
                  <span className="text-[10px] text-white/40 mt-1">Direct transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayment('easypaisa')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    payment === 'easypaisa'
                      ? 'border-green-500 bg-green-500/15 text-green-400'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                  }`}
                >
                  <Smartphone size={20} className="mb-2 text-green-400" />
                  <span className="font-semibold text-xs text-white">EasyPaisa</span>
                  <span className="text-[10px] text-white/40 mt-1">Direct transfer</span>
                </button>
              </div>

              {/* Online Payment Details */}
              <AnimatePresence>
                {(payment === 'jazzcash' || payment === 'easypaisa') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pt-2"
                  >
                    <div className="bg-white/5 border border-brand-gold/30 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60">Transfer to:</span>
                        <span className="font-mono font-bold text-brand-gold">
                          {payment === 'jazzcash'
                            ? paymentConfig.jazzcash?.accountNumber || '+92 339 666733'
                            : paymentConfig.easypaisa?.accountNumber || '+92 339 666733'}
                        </span>
                      </div>

                      <div>
                        <label className="input-label">Transaction ID (TID) *</label>
                        <input
                          type="text"
                          placeholder="e.g. TID-982374619"
                          className={`input-field uppercase font-mono ${errors.transactionId ? 'border-red-500/60' : ''}`}
                          value={paymentDetails.transactionId}
                          onChange={(e) => setPaymentDetails((d) => ({ ...d, transactionId: e.target.value }))}
                        />
                        {errors.transactionId && (
                          <p className="text-red-400 text-xs mt-1">{errors.transactionId}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-5 sm:p-6 sticky top-24">
              <h2 className="font-semibold text-white text-base mb-4">Order Items ({items.length})</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                      <p className="text-white/40 text-[11px]">{item.sizeLabel} × {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-brand-gold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 my-4 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-400' : ''}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
                  <span>Total Due</span>
                  <span className="text-brand-gold text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                id="confirm-order-btn"
                disabled={submitting}
                className="btn-gold w-full justify-center py-3.5 text-sm font-bold mt-4 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />
                    Submitting Order...
                  </span>
                ) : (
                  <>
                    <Crown size={16} /> Place Order Now
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
