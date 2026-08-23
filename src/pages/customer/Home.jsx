import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Crown, Star, Clock, MapPin, ChevronRight, Phone } from 'lucide-react';
import MenuCard from '../../components/ui/MenuCard';
import { menuService } from '../../services/menuService';
import { useApp } from '../../context/AppContext';

// ── Fade-in-up animation preset
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

// ── InView section wrapper
function Section({ children, className = '' }) {
  return <section className={`relative ${className}`}>{children}</section>;
}

// ── Testimonials data
const testimonials = [
  { name: 'Ahmed K.',     rating: 5, text: 'The Colossal Crunch burger is absolutely insane. Nothing like it in the city. STARVING forever!' },
  { name: 'Fatima S.',    rating: 5, text: 'Ordered the Signature Pizza XL for a family gathering. Everyone was blown away. Fast delivery too!' },
  { name: 'Usman R.',     rating: 5, text: 'Boom Boom Fusion Roll is something else. That sauce is magical. Already a weekly ritual for me.' },
  { name: 'Zara M.',      rating: 5, text: 'Best quality food in town. The packaging is premium, the food is even better. Real royal experience.' },
];

export default function Home() {
  const { settings } = useApp();
  const reviewsRef = useRef(null);

  const [featuredItems, setFeaturedItems] = useState(() =>
    menuService.getAll().filter(item => item.isFeatured && item.isAvailable)
  );

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'starving_menu') {
        setFeaturedItems(
          menuService.getAll().filter(item => item.isFeatured && item.isAvailable)
        );
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ================================================
          HERO SECTION
          ================================================ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, rgba(6,22,16,0.35) 0%, rgba(6,22,16,0.6) 50%, rgba(6,22,16,1) 100%), url('/images/theme/Gemini_Generated_Image_9n42wn9n42wn9n42.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Closed restaurant overlay */}
        {!settings.restaurantOpen && (
          <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <div className="text-center p-8">
              <p className="text-5xl mb-4">🔒</p>
              <h2 className="font-brand text-3xl text-white mb-2">We're Currently Closed</h2>
              <p className="text-white/60">We'll be back soon to satisfy the king in you.</p>
            </div>
          </div>
        )}

        {/* Gold decorative lines (matching brand theme image) */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />

        {/* Content */}
        <div className="relative z-[1] px-4 max-w-3xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex justify-center mb-6"
          >
            <img
              src="/images/logo/Screenshot 2026-08-22 112432.png"
              alt="STARVING"
              className="w-32 md:w-44 object-contain drop-shadow-[0_0_32px_rgba(201,168,76,0.6)]"
            />
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-brand text-5xl sm:text-7xl md:text-8xl tracking-widest mb-3"
            style={{ color: '#c9a84c', textShadow: '0 0 60px rgba(201,168,76,0.4)' }}
          >
            STARVING
          </motion.h1>

          {/* Ornament */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="ornament-line text-brand-gold mb-4 max-w-xs mx-auto"
          >
            <Crown size={14} />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl font-playfair italic text-white/85 mb-10"
          >
            Satisfy the king in you
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/menu" className="btn-gold text-base px-8 py-3.5 shadow-gold-lg">
              Order Now <ArrowRight size={18} />
            </Link>
            <a href="#featured" className="btn-outline-gold text-base px-8 py-3.5">
              View Menu
            </a>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex justify-center gap-8 mt-14"
          >
            {[
              { value: '50+', label: 'Menu Items'   },
              { value: '30',  label: 'Min Delivery'  },
              { value: '⭐5', label: 'Avg Rating'    },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-brand text-2xl text-brand-gold">{stat.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll arrow */}
        <motion.a
          href="#featured"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-brand-gold transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronRight size={16} className="rotate-90" />
          </motion.div>
        </motion.a>
      </section>

      {/* ================================================
          FEATURED MENU SECTION
          ================================================ */}
      <Section id="featured" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp()}>
            <span className="section-tag"><Crown size={12} /> Featured</span>
            <h2 className="section-title">Royal Picks</h2>
            <p className="section-subtitle mx-auto text-center">
              Our most beloved dishes — crafted for those who refuse to settle for anything less than extraordinary.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredItems.slice(0, 8).map((item, i) => (
              <MenuCard key={item.id} product={item} index={i} />
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
          ABOUT / BRAND STORY
          ================================================ */}
      <Section className="py-20 px-4 overflow-hidden" style={{ background: 'var(--green-dark)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp()}>
              <span className="section-tag">Our Story</span>
              <h2 className="section-title mb-6">Born from a Passion<br />for <span className="text-gold">Royal</span> Flavors</h2>
              <p className="text-white/60 leading-relaxed mb-4">
                STARVING was built on one belief: that everyone deserves to eat like royalty. We started as a small kitchen with big dreams — and a secret recipe that made people stop, close their eyes, and truly appreciate every bite.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Today, our menu spans over 50 items across burgers, pizzas, wraps, wings, pasta, and more. Every dish is crafted with premium ingredients, bold flavors, and the precision of a royal kitchen.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Crown, label: 'Premium Quality'    },
                  { icon: Clock, label: '~30 Min Delivery'   },
                  { icon: Star,  label: 'Royal Taste'        },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="glass-card p-4 text-center">
                    <Icon size={20} className="text-brand-gold mx-auto mb-2" />
                    <p className="text-xs text-white/60 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-brand-gold/20 shadow-gold">
                <img
                  src="/images/menu/Item placing Area.jpg"
                  alt="STARVING brand story"
                  className="w-full object-cover"
                  style={{ aspectRatio: '1' }}
                />
              </div>
              {/* Gold corner decorations */}
              <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-brand-gold/40 rounded-tr-xl" />
              <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-brand-gold/40 rounded-bl-xl" />
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ================================================
          CATEGORIES QUICK ACCESS
          ================================================ */}
      <Section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-10" {...fadeUp()}>
            <span className="section-tag">Explore</span>
            <h2 className="section-title">What Are You <span className="text-gold">Craving?</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🍔', label: 'Burgers', sub: '10 items' },
              { emoji: '🍕', label: 'Pizza',   sub: '8 pizzas' },
              { emoji: '🌯', label: 'Rolls',   sub: '5 rolls'  },
              { emoji: '🍗', label: 'Wings',   sub: '4 styles' },
              { emoji: '🍝', label: 'Pasta',   sub: '3 pastas' },
              { emoji: '🍟', label: 'Sides',   sub: '5 sides'  },
              { emoji: '🫔', label: 'Wraps',   sub: '4 wraps'  },
              { emoji: '🥤', label: 'Drinks',  sub: '3 drinks' },
            ].map(({ emoji, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/menu?category=${label}`}
                  className="glass-card p-5 flex flex-col items-center gap-2 hover:border-brand-gold/40 transition-all group text-center"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">{emoji}</span>
                  <p className="font-semibold text-white text-sm">{label}</p>
                  <p className="text-white/40 text-xs">{sub}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ================================================
          TESTIMONIALS
          ================================================ */}
      <Section ref={reviewsRef} className="py-20 px-4" style={{ background: 'var(--green-dark)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp()}>
            <span className="section-tag">Reviews</span>
            <h2 className="section-title">What Our <span className="text-gold">Kings Say</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} className="text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <p className="font-semibold text-brand-gold text-sm">— {t.name}</p>
              </motion.div>
            ))}
          </div>
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
            <Link to="/menu" className="btn-gold text-base px-10 py-4 shadow-gold-lg">
              Explore Full Menu <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
