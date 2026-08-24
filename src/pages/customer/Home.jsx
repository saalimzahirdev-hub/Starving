import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, Star, Flame } from 'lucide-react';
import MenuCard from '../../components/ui/MenuCard';
import DealsCarousel from '../../components/deals/DealsCarousel';
import DealsSection from '../../components/deals/DealsSection';
import ProductModal from '../../components/ui/ProductModal';
import { menuService } from '../../services/menuService';
import { useApp } from '../../context/AppContext';
import { reviewService } from '../../services/reviewService';

// ── Fade-in-up animation preset
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

// ── InView section wrapper
function Section({ children, className = '', id = '' }) {
  return <section id={id} className={`relative ${className}`}>{children}</section>;
}

export default function Home() {
  const { settings } = useApp();
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [selectedDealModal, setSelectedDealModal] = useState(null);

  const [featuredItems, setFeaturedItems] = useState(() => {
    try {
      return menuService.getAll().filter(item => item.isFeatured && item.isAvailable);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'starving_menu') {
        try {
          setFeaturedItems(
            menuService.getAll().filter(item => item.isFeatured && item.isAvailable)
          );
        } catch { /* ignore */ }
      }
      if (e.key === 'starving_reviews') {
        try {
          setFeaturedReviews(reviewService.getApproved().slice(0, 4));
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleStorage);
    // Initial load of reviews
    try {
      setFeaturedReviews(reviewService.getApproved().slice(0, 4));
    } catch { /* ignore */ }
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="overflow-x-hidden pt-16">
      {/* Closed restaurant overlay */}
      {settings && !settings.restaurantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
          <div className="text-center p-8 glass-card border-red-500/30 max-w-md mx-4">
            <p className="text-5xl mb-4">🔒</p>
            <h2 className="font-brand text-3xl text-white mb-2">We're Currently Closed</h2>
            <p className="text-white/60 text-sm">We'll be back soon to satisfy the king in you.</p>
          </div>
        </div>
      )}

      {/* ================================================
          DEALS SLIDING BANNER / DEALS CAROUSEL
          ================================================ */}
      <DealsCarousel onDealClick={(deal) => setSelectedDealModal(deal)} />

      {/* ================================================
          MAIN PRODUCTS & SIGNATURE ITEMS
          ================================================ */}
      <Section id="signature-items" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp()}>
            <span className="section-tag"><Crown size={12} /> Signature Collection</span>
            <h2 className="section-title">Main Products & <span className="text-gold">Signature Picks</span></h2>
            <p className="section-subtitle mx-auto text-center">
              Our most craved signature dishes — handcrafted with royal precision, premium ingredients, and legendary flavors.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredItems.slice(0, 8).map((item, i) => (
              <MenuCard key={item.id || i} product={item} index={i} />
            ))}
          </div>

          <motion.div className="text-center mt-10" {...fadeUp(0.2)}>
            <Link to="/menu" className="btn-outline-gold inline-flex items-center gap-2">
              View Full Menu <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ================================================
          PERMANENT DEALS SECTION (Featuring Launching Deals)
          ================================================ */}
      <DealsSection />

      {/* ================================================
          OUR STORY TEASER (links to full page)
          ================================================ */}
      <Section className="py-16 px-4" style={{ background: 'var(--green-dark)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="glass-card p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 border-brand-gold/20"
          >
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-3xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center shadow-[0_0_25px_rgba(201,168,76,0.2)]">
                <Crown size={36} className="text-brand-gold" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="section-tag">Our Story</span>
              <h2 className="font-brand text-2xl sm:text-3xl text-white mb-2">Born from a Passion for <span className="text-brand-gold">Royal</span> Flavors</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                From a small kitchen with big dreams to 50+ handcrafted dishes — discover the story behind STARVING and the values that drive every meal we serve.
              </p>
            </div>
            <Link to="/our-story" className="btn-outline-gold flex items-center gap-2 whitespace-nowrap flex-shrink-0">
              Read Our Story <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ================================================
          CATEGORIES QUICK ACCESS (With Deals Banner)
          ================================================ */}
      <Section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-10" {...fadeUp()}>
            <span className="section-tag">Explore</span>
            <h2 className="section-title">What Are You <span className="text-gold">Craving?</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { emoji: '🔥', label: 'Deals',   sub: '5 Launch Combos', highlight: true },
              { emoji: '🍔', label: 'Burgers', sub: '10 items' },
              { emoji: '🍕', label: 'Pizza',   sub: '8 pizzas' },
              { emoji: '🌯', label: 'Rolls',   sub: '5 rolls'  },
              { emoji: '🍗', label: 'Wings',   sub: '4 styles' },
              { emoji: '🍝', label: 'Pasta',   sub: '3 pastas' },
              { emoji: '🍟', label: 'Sides',   sub: '5 sides'  },
              { emoji: '🫔', label: 'Wraps',   sub: '4 wraps'  },
              { emoji: '🥤', label: 'Drinks',  sub: '3 drinks' },
            ].map(({ emoji, label, sub, highlight }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={label === 'Deals' ? '/menu?category=Deals' : `/menu?category=${label}`}
                  className={`glass-card p-5 flex flex-col items-center gap-2 transition-all group text-center ${
                    highlight
                      ? 'border-brand-gold/50 bg-gradient-to-b from-brand-gold/15 to-[#0e271a] shadow-[0_0_20px_rgba(201,168,76,0.2)]'
                      : 'hover:border-brand-gold/40'
                  }`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">{emoji}</span>
                  <p className={`font-semibold text-sm ${highlight ? 'text-brand-gold font-bold' : 'text-white'}`}>{label}</p>
                  <p className="text-white/40 text-xs">{sub}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ================================================
          CUSTOMER REVIEWS SECTION
          ================================================ */}
      <Section className="py-20 px-4" style={{ background: 'var(--green-dark)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp()}>
            <span className="section-tag"><Star size={12} className="fill-brand-gold" /> Reviews</span>
            <h2 className="section-title">What Our <span className="text-gold">Kings Say</span></h2>
            <p className="section-subtitle mx-auto text-center">Real reviews from real customers — unfiltered, authentic royal feedback.</p>
          </motion.div>

          {featuredReviews && featuredReviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {featuredReviews.map((r, i) => {
                const ratingCount = Math.min(5, Math.max(1, Math.round(Number(r?.rating) || 5)));
                return (
                  <motion.div
                    key={r.id || i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-5"
                  >
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: ratingCount }).map((_, j) => (
                        <Star key={j} size={13} className="text-brand-gold fill-brand-gold" />
                      ))}
                    </div>
                    <p className="text-white/65 text-sm leading-relaxed mb-4 italic">"{r.text || ''}"</p>
                    <p className="font-semibold text-brand-gold text-sm">— {r.name || 'Customer'}</p>
                    {r.orderItem && <p className="text-white/35 text-[10px] mt-1">Ordered: {r.orderItem}</p>}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div {...fadeUp(0.1)} className="text-center py-10 mb-8">
              <Star size={40} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No reviews yet — be the first royal to share your experience!</p>
            </motion.div>
          )}

          <motion.div className="text-center" {...fadeUp(0.2)}>
            <Link to="/reviews" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5">
              <Star size={16} className="fill-surface" />
              {featuredReviews && featuredReviews.length > 0 ? 'See All Reviews & Add Yours' : 'Be the First to Review!'}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ================================================
          CTA BANNER
          ================================================ */}
      <Section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp()}>
            <Crown size={36} className="text-brand-gold mx-auto mb-4" />
            <h2 className="section-title mb-4">Ready to Eat Like a King?</h2>
            <p className="text-white/55 mb-8">Browse our full menu and place your order in under 2 minutes.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#deals" className="btn-gold text-base px-8 py-4 shadow-gold-lg flex items-center justify-center gap-2">
                <Flame size={18} className="fill-surface" /> Claim Launching Deals
              </a>
              <Link to="/menu" className="btn-outline-gold text-base px-8 py-4 flex items-center justify-center">
                Explore Full Menu <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Deal Detail Modal */}
      {selectedDealModal && (
        <ProductModal
          product={selectedDealModal}
          onClose={() => setSelectedDealModal(null)}
        />
      )}
    </div>
  );
}
