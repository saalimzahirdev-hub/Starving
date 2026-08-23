import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Banknote, MapPin, Phone, User, FileText, Crown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod',    label: 'Cash on Delivery', icon: Banknote,    desc: 'Pay when you receive' },
  { id: 'online', label: 'Online Payment',   icon: CreditCard,  desc: 'Coming soon'           },
];

export default function Checkout() {
  const { items, subtotal, deliveryFee, promoDiscount, total, appliedPromo, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [payment, setPayment] = useState('cod');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Full name is required';
    if (!form.phone.trim())   e.phone   = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    if (form.phone && !/^[+\d\s-]{10,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900)); // simulate

    const order = placeOrder({
      customer: form,
      items: items.map(i => ({
        name:         i.name,
        size:         i.sizeLabel,
        addons:       i.addons,
        price:        i.price,
        originalPrice:i.originalPrice,
        quantity:     i.quantity,
        image:        i.image,
      })),
      subtotal,
      deliveryFee,
      promoDiscount,
      appliedPromo,
      total,
      paymentMethod: payment,
    });

    clearCart();
    setConfirmed(order);
    setSubmitting(false);
    toast.success('Order placed successfully!', {
      style: { background: '#16211a', color: '#e8f0ec', border: '1px solid rgba(201,168,76,0.3)' },
    });
  };

  // Order confirmed screen
  if (confirmed) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="glass-card p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            >
              <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="font-brand text-3xl text-white mb-2">Order Placed! 👑</h2>
            <p className="text-white/55 text-sm mb-6">Your order has been received by our kitchen.</p>

            <div className="bg-brand-gold/10 border border-brand-gold/25 rounded-xl p-4 mb-6">
              <p className="text-white/50 text-xs mb-1">Your Order ID</p>
              <p className="font-brand text-2xl text-brand-gold">{confirmed.id}</p>
            </div>

            <div className="text-left space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Estimated Time</span>
                <span className="text-white font-semibold">{confirmed.estimatedTime} minutes</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Payment</span>
                <span className="text-white font-semibold">{payment === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Total</span>
                <span className="price-current">{formatPrice(confirmed.total)}</span>
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
          <p className="text-white/45 text-sm mt-1">Complete your order below</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            {/* Left: Customer Details */}
            <div className="space-y-6">
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
                    placeholder="Street, area, city — be specific for faster delivery"
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

              {/* Payment Method */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-card p-5">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard size={16} className="text-brand-gold" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        payment === id
                          ? 'border-brand-gold/50 bg-brand-gold/8'
                          : 'border-white/10 bg-white/3 hover:border-white/20'
                      } ${id === 'online' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        className="sr-only"
                        checked={payment === id}
                        onChange={() => id !== 'online' && setPayment(id)}
                        disabled={id === 'online'}
                      />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payment === id ? 'bg-brand-gold/20' : 'bg-white/5'}`}>
                        <Icon size={18} className={payment === id ? 'text-brand-gold' : 'text-white/50'} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${payment === id ? 'text-brand-gold' : 'text-white'}`}>{label}</p>
                        <p className="text-white/40 text-xs">{desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 transition-all ${payment === id ? 'border-brand-gold bg-brand-gold' : 'border-white/30'}`} />
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Order Review */}
            <div className="space-y-4">
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
