import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Crown, Sparkles, ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';
import DealCard from '../ui/DealCard';
import { dealsData } from '../../data/dealsData';
import { menuService } from '../../services/menuService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

export default function DealsSection() {
  const [deals, setDeals] = useState(() => {
    const fromService = menuService.getDeals();
    return fromService.length > 0 ? fromService : dealsData;
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'starving_menu') {
        const updated = menuService.getDeals();
        if (updated.length > 0) setDeals(updated);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <section id="deals" className="relative py-16 sm:py-24 px-4 overflow-hidden bg-gradient-to-b from-[#001f1c] via-[#002e29] to-[#001f1c]">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Gold pattern accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#c9a84c_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div className="text-center mb-14" {...fadeUp()}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold/15 via-brand-gold/25 to-brand-gold/15 border border-brand-gold/40 text-brand-gold px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(201,168,76,0.25)]">
            <Flame size={14} className="fill-brand-gold text-brand-gold animate-pulse" />
            <span>Grand Launching Deals</span>
            <Sparkles size={13} />
          </div>

          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl mb-4">
            Feast Like a King, <span className="text-gold">Save Like a Boss</span>
          </h2>

          <p className="section-subtitle max-w-2xl mx-auto text-center text-sm sm:text-base text-white/70">
            Exclusive grand opening deals curated for true royal satisfaction. Complete meals, gourmet pizzas, crispy zingers, and flavorful platters bundled at sensational prices!
          </p>

          {/* Quick value props bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 text-xs text-white/70">
            <span className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Zap size={13} className="text-brand-gold" /> Instant Kitchen Prep
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Clock size={13} className="text-brand-gold" /> Limited Launching Window
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <ShieldCheck size={13} className="text-brand-gold" /> 100% Premium Ingredients
            </span>
          </div>
        </motion.div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {deals.map((deal, index) => (
            <DealCard key={deal.id} deal={deal} index={index} />
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div
          className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#003b34]/90 via-[#004d44]/90 to-[#003b34]/90 border border-brand-gold/30 shadow-gold flex flex-col md:flex-row items-center justify-between gap-6"
          {...fadeUp(0.3)}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold flex-shrink-0 shadow-[0_0_15px_rgba(201,168,76,0.3)]">
              <Crown size={24} />
            </div>
            <div>
              <h4 className="font-brand text-base sm:text-lg text-white">Want to explore our complete culinary collection?</h4>
              <p className="text-white/60 text-xs mt-0.5">Discover 50+ handcrafted burgers, pizzas, rolls, pasta, wings & more.</p>
            </div>
          </div>

          <Link
            to="/menu"
            className="btn-gold flex items-center gap-2 text-sm px-6 py-3 shadow-gold whitespace-nowrap hover:scale-105 transition-transform"
          >
            Explore Full Royal Menu <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
