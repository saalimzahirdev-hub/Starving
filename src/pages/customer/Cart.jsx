import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, Tag, ArrowRight, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';

export default function CartPage() {
  const { items, itemCount, subtotal, deliveryFee, promoDiscount, total, appliedPromo,
          removeItem, updateQty, clearCart, applyPromo, removePromo } = useCart();
  const { settings } = useApp();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const handlePromo = async (e) => {
    e.preventDefault();
    setPromoLoading(true);
    await new Promise(r => setTimeout(r, 400)); // simulate latency
    applyPromo(promoInput.trim());
    setPromoLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-4 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm"
        >
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="font-brand text-2xl text-white mb-2">Your cart is empty</h2>
          <p className="text-white/45 text-sm mb-8">Add some royal dishes and come back here to order.</p>
          <Link to="/menu" className="btn-gold">
            Browse Menu <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const freeDeliveryProgress = Math.min(100, (subtotal / settings.freeDeliveryAbove) * 100);
  const freeDeliveryRemaining = Math.max(0, settings.freeDeliveryAbove - subtotal);

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between py-8"
        >
          <div>
            <h1 className="font-brand text-3xl text-white">Your Cart</h1>
            <p className="text-white/45 text-sm mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={clearCart} className="btn-red text-xs py-2 px-4">
            <Trash2 size={14} /> Clear All
          </button>
        </motion.div>

        {/* Free delivery progress */}
        {deliveryFee > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mb-6"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-white/70">
                Add <span className="text-brand-gold font-semibold">{formatPrice(freeDeliveryRemaining)}</span> more for FREE delivery!
              </p>
              <span className="text-xs text-white/40">{Math.round(freeDeliveryProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${freeDeliveryProgress}%` }}
                className="h-full bg-brand-gold rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Items list */}
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="glass-card p-4 flex gap-4"
                >
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-card">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={e => e.target.style.display = 'none'}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className="font-semibold text-white text-xs sm:text-sm leading-snug truncate">{item.name}</h3>
                    <p className="text-white/40 text-xs mt-0.5">{item.sizeLabel}</p>
                    {item.addons?.length > 0 && (
                      <p className="text-white/30 text-xs mt-0.5">
                        + {item.addons.map(a => a.name).join(', ')}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="qty-stepper">
                        <button onClick={() => updateQty(item.cartItemId, item.quantity - 1)}>
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.cartItemId, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="price-current text-sm">{formatPrice(item.price * item.quantity)}</span>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-white/25 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Promo Code */}
            <div className="glass-card p-4">
              <p className="input-label mb-3">Promo Code</p>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">{appliedPromo.code}</span>
                    <span className="text-white/50 text-xs">
                      ({appliedPromo.type === 'percent' ? `${appliedPromo.discount}% off` : `PKR ${appliedPromo.discount} off`})
                    </span>
                  </div>
                  <button onClick={removePromo} className="text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    className="input-field flex-1 py-2.5 text-sm"
                    id="promo-input"
                  />
                  <button type="submit" className="btn-gold text-xs py-2.5 px-4" disabled={promoLoading || !promoInput.trim()}>
                    {promoLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Price Summary */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="font-semibold text-white mb-4">Order Summary</h3>
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-green-400 font-semibold' : ''}>
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Promo Discount</span>
                  <span>−{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="gold-divider" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Total</span>
                <span className="price-current text-xl">{formatPrice(total)}</span>
              </div>

              {total < settings.minOrderAmount && (
                <p className="text-yellow-500/80 text-xs text-center mt-2">
                  Minimum order is {formatPrice(settings.minOrderAmount)}
                </p>
              )}

              <button
                onClick={() => navigate('/checkout')}
                disabled={total < settings.minOrderAmount}
                className="btn-gold w-full justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                id="proceed-checkout"
              >
                Proceed to Checkout <ChevronRight size={16} />
              </button>
              <Link to="/menu" className="block text-center text-white/35 text-xs hover:text-white/60 transition-colors mt-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
