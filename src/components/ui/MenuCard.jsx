import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { formatPrice, calcDiscount } from '../../utils/formatters';
import ProductModal from './ProductModal';

export default function MenuCard({ product, index = 0 }) {
  const [showModal, setShowModal] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  if (!product.isAvailable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className="glass-card overflow-hidden opacity-50 select-none"
      >
        <div className="relative h-44 bg-surface-card flex items-center justify-center">
          <span className="text-white/30 text-sm">Unavailable</span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white/50">{product.name}</h3>
          <p className="text-xs text-white/30 mt-1">Currently unavailable</p>
        </div>
      </motion.div>
    );
  }

  const minVariant = product.variants.reduce((m, v) => v.price < m.price ? v : m, product.variants[0]);
  const discount = calcDiscount(minVariant.price, minVariant.originalPrice);
  const hasMultipleSizes = product.variants.length > 1;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
        className="glass-card overflow-hidden cursor-pointer group"
        onClick={() => setShowModal(true)}
        role="button"
        aria-label={`View ${product.name} options`}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setShowModal(true)}
      >
        {/* Image */}
        <div className="relative h-36 sm:h-44 overflow-hidden bg-surface-card">
          {!imgErr ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-green-900 to-green-950">
              {product.category === 'Burgers' ? '🍔' :
               product.category === 'Pizza'   ? '🍕' :
               product.category === 'Rolls'   ? '🌯' :
               product.category === 'Wraps'   ? '🫔' :
               product.category === 'Wings'   ? '🍗' :
               product.category === 'Pasta'   ? '🍝' :
               product.category === 'Sides'   ? '🍟' : '🥤'}
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111815]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            )}
            {product.isPopular && (
              <span className="flex items-center gap-1 bg-brand-gold text-surface text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Star size={8} fill="currentColor" /> Popular
              </span>
            )}
          </div>
          {/* Category */}
          <span className="absolute top-3 right-3 text-[10px] font-semibold bg-black/50 text-white/70 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white group-hover:text-brand-gold transition-colors duration-200 text-sm sm:text-base leading-snug">
            {product.name}
          </h3>
          <p className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Sizes hint */}
          {hasMultipleSizes && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.variants.map(v => (
                <span key={v.size} className="text-[10px] text-white/40 border border-white/10 rounded px-1.5 py-0.5">
                  {v.size}
                </span>
              ))}
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-white/40 text-[10px] font-medium">
                {hasMultipleSizes ? 'Starting from' : ''}
              </span>
              <div className="flex items-center gap-2">
                <span className="price-current">{formatPrice(minVariant.price)}</span>
                {minVariant.originalPrice > minVariant.price && (
                  <span className="price-original">{formatPrice(minVariant.originalPrice)}</span>
                )}
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={e => { e.stopPropagation(); setShowModal(true); }}
              className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold/30 transition-all group-hover:bg-brand-gold group-hover:text-surface flex-shrink-0"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <ProductModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
