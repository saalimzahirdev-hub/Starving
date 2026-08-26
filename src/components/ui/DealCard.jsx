import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Sparkles, Flame, Eye, ArrowRight } from 'lucide-react';
import { formatPrice, calcDiscount } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import ProductModal from './ProductModal';

export default function DealCard({ deal, index = 0 }) {
  const { addItem } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const variant = deal.variants?.[0] || {
    size: 'Combo',
    label: deal.name,
    price: deal.price,
    originalPrice: deal.originalPrice,
  };

  const discount = calcDiscount(variant.price, variant.originalPrice) || deal.discount || 0;
  const savings = (variant.originalPrice && variant.price) ? (variant.originalPrice - variant.price) : 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addItem(deal, variant, [], 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
        className="glass-card group relative flex flex-col overflow-hidden rounded-2xl border border-brand-gold/25 hover:border-brand-gold/60 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(201,168,76,0.2)] bg-gradient-to-b from-[#12281e]/90 to-[#0a1b14]/95"
      >
        {/* Deal Image Container */}
        <div
          className="relative h-60 sm:h-64 overflow-hidden bg-black/40 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {!imgErr ? (
            <img
              src={deal.image}
              alt={deal.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-950 to-[#091f15] text-brand-gold p-4 text-center">
              <Flame size={36} className="mb-2 text-brand-gold animate-bounce" />
              <p className="font-brand text-lg">{deal.name}</p>
            </div>
          )}

          {/* Luxury Vignette & Shimmer Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1b14] via-transparent to-black/30 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="flex items-center gap-1 bg-brand-gold text-surface text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-lg">
              <Flame size={12} className="fill-surface" />
              {deal.badge || 'Launching Deal'}
            </span>

            {discount > 0 && (
              <span className="bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Savings pill */}
          {savings > 0 && (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-brand-gold/30 text-brand-gold text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              Save {formatPrice(savings)}
            </div>
          )}

          {/* Quick View hover prompt */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
            <button
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              className="flex items-center gap-1.5 bg-brand-gold text-surface font-semibold text-xs px-4 py-2 rounded-full shadow-gold hover:bg-[#d9b759] transition-all transform group-hover:translate-y-0 translate-y-2"
            >
              <Eye size={14} /> View Details
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 sm:gap-4">
          <div>
            {/* Tagline */}
            {deal.tagline && (
              <p className="text-brand-gold/80 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles size={12} /> {deal.tagline}
              </p>
            )}

            {/* Deal Title */}
            <h3
              onClick={() => setShowModal(true)}
              className="font-brand text-lg sm:text-xl text-white group-hover:text-brand-gold transition-colors cursor-pointer leading-tight mb-2"
            >
              {deal.name}
            </h3>

            {/* Short Description */}
            <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-3">
              {deal.description}
            </p>

            {/* Items Included Checklist */}
            {deal.itemsIncluded && deal.itemsIncluded.length > 0 && (
              <div className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-1.5 mb-2">
                <p className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider">What's Included:</p>
                {deal.itemsIncluded.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                    <span className="w-4 h-4 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[10px] flex-shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Action */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-brand text-xl sm:text-2xl text-brand-gold font-bold">
                  {formatPrice(variant.price)}
                </span>
                {variant.originalPrice > variant.price && (
                  <span className="text-white/40 text-xs line-through">
                    {formatPrice(variant.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-white/50 block">Exclusive Limited Time Price</span>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                addedAnim
                  ? 'bg-green-500 text-white shadow-green-500/30'
                  : 'btn-gold shadow-gold-sm hover:shadow-gold'
              }`}
            >
              {addedAnim ? (
                <>
                  <Check size={14} strokeWidth={3} /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>Claim Deal</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal on Click */}
      {showModal && (
        <ProductModal product={deal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
