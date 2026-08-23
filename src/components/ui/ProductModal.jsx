import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, Crown, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, calcDiscount } from '../../utils/formatters';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 30, stiffness: 350 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } },
};

const desktopVariants = {
  hidden: { scale: 0.92, opacity: 0, y: 20 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 28, stiffness: 320 } },
  exit: { scale: 0.92, opacity: 0, y: 20, transition: { duration: 0.18 } },
};

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [qty, setQty] = useState(1);
  const [isMobile] = useState(() => window.innerWidth < 768);

  const toggleAddon = useCallback((addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  }, []);

  const addonTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
  const unitPrice = selectedVariant.price + addonTotal;
  const totalPrice = unitPrice * qty;
  const discount = calcDiscount(selectedVariant.price, selectedVariant.originalPrice);

  const handleAdd = () => {
    addItem(product, selectedVariant, selectedAddons, qty);
    onClose();
  };

  const ModalContent = () => (
    <div className="flex flex-col h-full max-h-[90vh] overflow-y-auto">
      {/* Image Header */}
      <div className="relative flex-shrink-0 h-56 md:h-64 overflow-hidden bg-surface-card">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'var(--green-dark)'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111815] via-transparent to-transparent" />
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-5 flex-1">
        {/* Name & Description */}
        <div>
          <h2 className="font-brand text-2xl text-white mb-1">{product.name}</h2>
          <p className="text-white/60 text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Size / Variant Selector */}
        {product.variants.length > 1 && (
          <div>
            <p className="input-label mb-3">Select Size</p>
            <div className="grid grid-cols-2 gap-2">
              {product.variants.map(v => {
                const isSelected = selectedVariant.size === v.size;
                const disc = calcDiscount(v.price, v.originalPrice);
                return (
                  <button
                    key={v.size}
                    onClick={() => setSelectedVariant(v)}
                    className={`relative p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-gold bg-brand-gold/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-gold flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-surface" />
                      </div>
                    )}
                    <p className={`text-sm font-semibold ${isSelected ? 'text-brand-gold' : 'text-white'}`}>
                      {v.label}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white font-bold text-sm">{formatPrice(v.price)}</span>
                      {v.originalPrice > v.price && (
                        <span className="text-white/35 text-xs line-through">{formatPrice(v.originalPrice)}</span>
                      )}
                    </div>
                    {disc > 0 && (
                      <span className="text-green-400 text-xs font-bold">{disc}% off</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {product.addons?.length > 0 && (
          <div>
            <p className="input-label mb-3">Add-ons <span className="normal-case text-white/40 font-normal">(optional)</span></p>
            <div className="space-y-2">
              {product.addons.map(addon => {
                const checked = selectedAddons.some(a => a.id === addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      checked ? 'border-brand-gold/50 bg-brand-gold/8' : 'border-white/10 bg-white/3 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        checked ? 'bg-brand-gold border-brand-gold' : 'border-white/30'
                      }`}>
                        {checked && <div className="w-2.5 h-2.5 bg-surface rounded-sm" />}
                      </div>
                      <span className="text-sm text-white/80">{addon.name}</span>
                    </div>
                    <span className="text-sm text-brand-gold font-semibold">+{formatPrice(addon.price)}</span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleAddon(addon)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <p className="input-label">Quantity</p>
          <div className="qty-stepper">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}><Plus size={14} /></button>
          </div>
        </div>

        <div className="gold-divider" />

        {/* Price Summary */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white/50 text-xs">Total Price</p>
            <p className="price-current text-xl">{formatPrice(totalPrice)}</p>
            {addonTotal > 0 && (
              <p className="text-white/40 text-xs mt-0.5">
                Base {formatPrice(unitPrice - addonTotal)} + Add-ons {formatPrice(addonTotal)}
              </p>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="btn-gold flex items-center gap-2 text-sm"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        {isMobile ? (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full rounded-t-3xl overflow-hidden"
            style={{ background: 'var(--surface-card)', border: '1px solid var(--border-gold)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <ModalContent />
          </motion.div>
        ) : (
          <motion.div
            variants={desktopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-lg rounded-2xl overflow-hidden"
            style={{ background: 'var(--surface-card)', border: '1px solid var(--border-gold)' }}
            onClick={e => e.stopPropagation()}
          >
            <ModalContent />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
