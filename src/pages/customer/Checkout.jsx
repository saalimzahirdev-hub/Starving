import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Banknote, Smartphone, Copy, Check, MapPin, Phone, User, Crown, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, subtotal, deliveryFee, promoDiscount, total, appliedPromo, clearCart } = useCart();
  const { placeOrder } = useOrders();
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
    if (!form.name.trim())    e.name    = 'Full name is required';
    if (!form.phone.trim())   e.phone   = 'Phone number is required';
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
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));

    const selectedOnlineMethod = payment === 'jazzcash' ? 'JazzCash' : payment === 'easypaisa' ? 'EasyPaisa' : 'Cash on Delivery';

    const order = placeOrder({
      customer: form,
      items: items.map(i => ({
        name:          i.name,
        size:          i.sizeLabel,
        addons:        i.addons,
        price:         i.price,
        originalPrice: i.originalPrice,
        quantity:      i.quantity,
        image:         i.image,
      })),
      subtotal,
      deliveryFee,
      promoDiscount,
      appliedPromo,
      total,
      paymentMethod: payment,
      paymentMethodLabel: selectedOnlineMethod,
      paymentStatus: payment === 'cod' ? 'unpaid' : 'pending_verification',
      onlinePaymentDetails: (payment === 'jazzcash' || payment === 'easypaisa') ? {
        accountName: selectedOnlineMethod,
        transactionId: paymentDetails.transactionId.trim(),
        senderPhone: paymentDetails.senderPhone.trim() || form.phone,
        transferredTo: payment === 'jazzcash' ? paymentConfig.jazzcash?.accountNumber : paymentConfig.easypaisa?.accountNumber,
      } : null,
    });

    clearCart();
    setConfirmed(order);
    setSubmitting(false);
    toast.success('Order placed successfully!', {
      style: { background: '#161e1b', color: '#e8f0ec', border: '1px solid rgba(201,168,76,0.3)' },
    });
  };

  // Order confirmed screen
  if (confirmed) {
    const isOnline = confirmed.paymentMethod === 'jazzcash' || confirmed.paymentMethod === 'easypaisa';

    return (
      <div className="min-h-screen pt-20 pb-10 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="glass-card p-8 border-brand-gold/30 shadow-[0_0_30px_rgba(201,168,76,0.15)]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            >
              <CheckCircle size={64} className="text-brand-gold mx-auto mb-4" />
            </motion.div>
            <h2 className="font-brand text-3xl text-white mb-2">Order Placed! 👑</h2>
            <p className="text-white/60 text-sm mb-6">Your order has been received by our royal kitchen.</p>

            <div className="bg-brand-gold/10 border border-brand-gold/25 rounded-xl p-4 mb-6">
              <p className="text-white/50 text-xs mb-1">Your Order ID</p>
              <p className="font-brand text-2xl text-brand-gold">{confirmed.id}</p>
            </div>

            <div className="text-left space-y-2 mb-6 text-sm bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between text-white/60">
                <span>Estimated Delivery</span>
                <span className="text-white font-semibold">~{confirmed.estimatedTime || 30} minutes</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Payment Method</span>
                <span className="text-brand-gold font-semibold">
                  {confirmed.paymentMethod === 'jazzcash' ? '🟠 JazzCash' : confirmed.paymentMethod === 'easypaisa' ? '🟢 EasyPaisa' : '💵 Cash on Delivery'}
                </span>
              </div>
              {isOnline && confirmed.onlinePaymentDetails?.transactionId && (
                <div className="flex justify-between text-white/60 pt-1 border-t border-white/5">
                  <span>Transaction ID (TID)</span>
                  <span className="text-white font-mono text-xs bg-white/10 px-2 py-0.5 rounded">{confirmed.onlinePaymentDetails.transactionId}</span>
                </div>
              )}
              {isOnline && (
                <div className="flex justify-between text-white/60">
                  <span>Payment Status</span>
                  <span className="text-amber-400 font-medium text-xs">Pending Verification</span>
                </div>
              )}
              <div className="flex justify-between text-white/60 pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="price-current text-base font-bold">{formatPrice(confirmed.total)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(`/track-order/${confirmed.id}`)}
                className="btn-gold w-full justify-center"
                id="track-order-btn"
              >
                Track My Order
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-outline-gold w-full justify-center text-xs"
              >
                Back to Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          <h1 className="font-brand text-3xl text-white">Checkout</h1>
          <p className="text-white/45 text-sm mt-1">Complete your royal order below</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            {/* Left: Customer Details & Payment Options */}
            <div className="space-y-6 order-2 lg:order-1">
              {/* Contact Info */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <User size={16} className="text-brand-gold" /> Customer Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkout-name" className="input-label">Full Name *</label>
                    <input
                      id="checkout-name"
                      type="text"
                      placeholder="Your full name"
                      className={`input-field ${errors.name ? 'border-red-500/50' : ''}`}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className="input-label">Phone Number *</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
                      <input
                        id="checkout-phone"
                        type="tel"
                        placeholder="+92 300 0000000"
                        className={`input-field pl-10 ${errors.phone ? 'border-red-500/50' : ''}`}
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </motion.div>

              {/* Delivery Address */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-brand-gold" /> Delivery Address
                </h2>
                <div>
                  <label htmlFor="checkout-address" className="input-label">Address *</label>
                  <textarea
                    id="checkout-address"
                    placeholder="Street, house/flat #, area, city — be specific for faster delivery"
                    rows={3}
                    className={`input-field resize-none ${errors.address ? 'border-red-500/50' : ''}`}
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
                <div className="mt-4">
                  <label htmlFor="checkout-notes" className="input-label">Special Instructions <span className="normal-case text-white/30 font-normal">(optional)</span></label>
                  <textarea
                    id="checkout-notes"
                    placeholder="Allergy info, gate instructions, extra napkins..."
                    rows={2}
                    className="input-field resize-none"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>
              </motion.div>

              {/* Payment Method Selection */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-card p-5">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Banknote size={16} className="text-brand-gold" /> Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  {paymentConfig.cod?.enabled !== false && (
                    <label
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        payment === 'cod'
                          ? 'border-brand-gold/60 bg-brand-gold/10 shadow-[0_0_15px_rgba(201,168,76,0.12)]'
                          : 'border-white/10 bg-white/3 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        className="sr-only"
                        checked={payment === 'cod'}
                        onChange={() => setPayment('cod')}
                      />
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${payment === 'cod' ? 'bg-brand-gold/25' : 'bg-white/5'}`}>
                        <Banknote size={20} className={payment === 'cod' ? 'text-brand-gold' : 'text-white/50'} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${payment === 'cod' ? 'text-brand-gold' : 'text-white'}`}>Cash on Delivery (COD)</p>
                        <p className="text-white/40 text-xs">Pay cash when rider delivers to your doorstep</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${payment === 'cod' ? 'border-brand-gold bg-brand-gold' : 'border-white/30'}`}>
                        {payment === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-surface" />}
                      </div>
                    </label>
                  )}

                  {/* JazzCash Option */}
                  {paymentConfig.jazzcash?.enabled !== false && (
                    <label
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        payment === 'jazzcash'
                          ? 'border-orange-500/60 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                          : 'border-white/10 bg-white/3 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="jazzcash"
                        className="sr-only"
                        checked={payment === 'jazzcash'}
                        onChange={() => setPayment('jazzcash')}
                      />
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${payment === 'jazzcash' ? 'bg-orange-500 text-white' : 'bg-orange-500/20 text-orange-400'}`}>
                        JC
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold text-sm ${payment === 'jazzcash' ? 'text-orange-400' : 'text-white'}`}>JazzCash</p>
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold uppercase">Instant</span>
                        </div>
                        <p className="text-white/40 text-xs">Transfer via JazzCash app or mobile account</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${payment === 'jazzcash' ? 'border-orange-500 bg-orange-500' : 'border-white/30'}`}>
                        {payment === 'jazzcash' && <div className="w-1.5 h-1.5 rounded-full bg-surface" />}
                      </div>
                    </label>
                  )}

                  {/* EasyPaisa Option */}
                  {paymentConfig.easypaisa?.enabled !== false && (
                    <label
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        payment === 'easypaisa'
                          ? 'border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'border-white/10 bg-white/3 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="easypaisa"
                        className="sr-only"
                        checked={payment === 'easypaisa'}
                        onChange={() => setPayment('easypaisa')}
                      />
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${payment === 'easypaisa' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        EP
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold text-sm ${payment === 'easypaisa' ? 'text-emerald-400' : 'text-white'}`}>EasyPaisa</p>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">Instant</span>
                        </div>
                        <p className="text-white/40 text-xs">Transfer via EasyPaisa app or mobile account</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${payment === 'easypaisa' ? 'border-emerald-500 bg-emerald-500' : 'border-white/30'}`}>
                        {payment === 'easypaisa' && <div className="w-1.5 h-1.5 rounded-full bg-surface" />}
                      </div>
                    </label>
                  )}
                </div>

                {/* ── Dynamic Online Payment Instructions & TID Form ── */}
                <AnimatePresence>
                  {(payment === 'jazzcash' || payment === 'easypaisa') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-5"
                    >
                      <div className={`p-4 sm:p-5 rounded-2xl border ${
                        payment === 'jazzcash'
                          ? 'bg-orange-500/5 border-orange-500/25'
                          : 'bg-emerald-500/5 border-emerald-500/25'
                      }`}>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                            <Smartphone size={16} className={payment === 'jazzcash' ? 'text-orange-400' : 'text-emerald-400'} />
                            {payment === 'jazzcash' ? 'JazzCash Account Details' : 'EasyPaisa Account Details'}
                          </h3>
                          <span className="text-[11px] text-white/50">Total: <strong className="text-brand-gold">{formatPrice(total)}</strong></span>
                        </div>

                        {/* Account Box with 1-Click Copy */}
                        <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/50">Account Number / Mobile</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm sm:text-base text-white tracking-wide break-all">
                                {payment === 'jazzcash'
                                  ? (paymentConfig.jazzcash?.accountNumber || '+92 339 666733')
                                  : (paymentConfig.easypaisa?.accountNumber || '+92 339 666733')}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(
                                  payment === 'jazzcash'
                                    ? (paymentConfig.jazzcash?.accountNumber || '+92 339 666733')
                                    : (paymentConfig.easypaisa?.accountNumber || '+92 339 666733'),
                                  payment === 'jazzcash' ? 'JazzCash Number' : 'EasyPaisa Number'
                                )}
                                className="px-2 py-1 bg-white/10 hover:bg-brand-gold hover:text-surface text-white text-xs rounded-lg transition-all flex items-center gap-1"
                              >
                                {copiedField ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                <span>Copy</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <span className="text-xs text-white/50">Account Title</span>
                            <span className="font-semibold text-xs text-brand-gold">
                              {payment === 'jazzcash'
                                ? (paymentConfig.jazzcash?.accountTitle || 'STARVING / Fast Food')
                                : (paymentConfig.easypaisa?.accountTitle || 'STARVING / Fast Food')}
                            </span>
                          </div>
                        </div>

                        {/* Instructions */}
                        <p className="text-xs text-white/60 mb-4 flex items-start gap-1.5">
                          <Info size={14} className="text-brand-gold flex-shrink-0 mt-0.5" />
                          <span>
                            Send <strong>{formatPrice(total)}</strong> to the number above from your {payment === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} app, then enter the Transaction ID below.
                          </span>
                        </p>

                        {/* Transaction ID Input */}
                        <div className="space-y-3">
                          <div>
                            <label className="input-label flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <span>Transaction ID (TID) / Ref # *</span>
                              <span className="text-[10px] text-white/40 normal-case font-normal">From SMS / App receipt</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 02938475610"
                              className={`input-field font-mono uppercase ${errors.transactionId ? 'border-red-500/60' : ''}`}
                              value={paymentDetails.transactionId}
                              onChange={e => setPaymentDetails(d => ({ ...d, transactionId: e.target.value }))}
                            />
                            {errors.transactionId && (
                              <p className="text-red-400 text-xs mt-1">{errors.transactionId}</p>
                            )}
                          </div>

                          <div>
                            <label className="input-label">
                              Sender Mobile Number <span className="normal-case text-white/30 font-normal">(optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Your JazzCash/EasyPaisa mobile number"
                              className="input-field"
                              value={paymentDetails.senderPhone}
                              onChange={e => setPaymentDetails(d => ({ ...d, senderPhone: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Right: Order Review */}
            <div className="space-y-4 order-1 lg:order-2">
              <div className="glass-card p-5">
                <h2 className="font-semibold text-white mb-4">Order Review</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.cartItemId} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-card">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{item.name}</p>
                        <p className="text-white/40 text-xs">{item.sizeLabel} × {item.quantity}</p>
                      </div>
                      <p className="text-white text-xs font-semibold flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="gold-divider mt-4 mb-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/55">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-white/55">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-400' : ''}>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Promo</span>
                      <span>−{formatPrice(promoDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="price-current text-lg">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  id="confirm-order-btn"
                  disabled={submitting}
                  className="btn-gold w-full justify-center mt-5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-surface/40 border-t-surface rounded-full"
                      />
                      Placing Order...
                    </span>
                  ) : (
                    <>
                      <Crown size={16} /> Confirm Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
