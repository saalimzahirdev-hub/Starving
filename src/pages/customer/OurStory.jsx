import { motion } from 'framer-motion';
import { Crown, Star, Clock, Heart, Utensils, ChefHat, ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const milestones = [
  { year: '2024', title: 'The Kitchen Dream', desc: 'Started as a small passion project in a home kitchen — just a fryer, a dream, and a secret sauce recipe that made people obsessed.' },
  { year: '2025', title: 'The Menu Explosion', desc: 'Expanded from 5 items to 50+ — burgers, pizzas, rolls, wraps, pasta, wings, and more. The king\'s feast was now complete.' },
  { year: '2026', title: 'Grand Launch & 5 Deals', desc: 'Official launch with 5 exclusive grand deals, a brand-new identity, and a promise: satisfy the king in you, every single time.' },
];

const values = [
  { icon: Crown,    title: 'Premium Quality',  desc: 'We use only the finest ingredients — fresh produce, premium meats, and artisanal sauces crafted in-house.' },
  { icon: Heart,    title: 'Made with Love',    desc: 'Every dish is prepared with genuine care and passion. We treat every order like it\'s for royalty.' },
  { icon: Utensils, title: 'Bold Flavors',      desc: 'Our recipes are designed to make you close your eyes and savor every single bite. No bland, no boring.' },
  { icon: Clock,    title: 'Fast Delivery',     desc: 'Hot, fresh, and at your door in ~30 minutes. We know hunger doesn\'t wait, and neither do we.' },
  { icon: ChefHat,  title: 'Royal Recipes',     desc: 'Developed by food enthusiasts who believe fast food can also be gourmet. Recipes refined over 100+ iterations.' },
  { icon: Star,     title: '5-Star Rated',      desc: 'Consistently rated 5 stars by our customers. Our quality speaks for itself, one royal bite at a time.' },
];

export default function OurStory() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ══ HERO BANNER ══ */}
      <section
        className="relative min-h-[50vh] flex flex-col items-center justify-center text-center overflow-hidden pt-24 pb-16"
        style={{
          background: `linear-gradient(to bottom, rgba(6,22,16,0.5) 0%, rgba(6,22,16,0.85) 60%, rgba(6,22,16,1) 100%), url('/Menu/Item placing Area.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08)_0%,transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 px-4 max-w-3xl mx-auto"
        >
          <span className="section-tag"><Crown size={12} /> Our Story</span>
          <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl tracking-wider mb-4" style={{ color: '#c9a84c', textShadow: '0 0 40px rgba(201,168,76,0.3)' }}>
            Born from a Passion<br />for <span className="italic font-playfair">Royal</span> Flavors
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
            From a small home kitchen to the city's most craved food brand — this is the STARVING story.
          </p>
        </motion.div>
      </section>

      {/* ══ THE STORY ══ */}
      <section className="py-20 px-4" style={{ background: 'var(--green-dark)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-brand text-3xl text-white mb-6">
                How It All <span className="text-brand-gold">Started</span>
              </h2>
              <p className="text-white/65 leading-relaxed mb-4">
                STARVING was built on one belief: that everyone deserves to eat like royalty. We started as a small kitchen with big dreams — just a fryer, fresh ingredients, and a secret recipe that made people stop, close their eyes, and truly appreciate every bite.
              </p>
              <p className="text-white/65 leading-relaxed mb-4">
                What began as late-night cooking sessions for friends quickly turned into a word-of-mouth phenomenon. People couldn't stop talking about the flavors, the crunch, the sauces. Orders poured in. The dream became a mission.
              </p>
              <p className="text-white/65 leading-relaxed">
                Today, our menu spans over 50 items across burgers, pizzas, wraps, wings, pasta, rolls, and more. Every single dish is crafted with premium ingredients, bold flavors, and the precision of a royal kitchen.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-brand-gold/20 shadow-gold">
                <img
                  src="/Menu/Item placing Area.jpg"
                  alt="STARVING kitchen"
                  className="w-full object-cover"
                  style={{ aspectRatio: '1' }}
                  onError={(e) => { e.target.src = '/Theme/Gemini_Generated_Image_9n42wn9n42wn9n42.jpg'; }}
                />
              </div>
              <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-brand-gold/40 rounded-tr-xl" />
              <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-brand-gold/40 rounded-bl-xl" />
            </motion.div>
          </motion.div>

          {/* Timeline */}
          <motion.div {...fadeUp(0.1)} className="mb-16">
            <h3 className="section-title text-center mb-12">Our <span className="text-gold">Journey</span></h3>
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="glass-card p-6 flex items-start gap-5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                    <span className="font-brand text-xl text-brand-gold">{m.year}</span>
                  </div>
                  <div>
                    <h4 className="font-brand text-lg text-white mb-1">{m.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ OUR VALUES ══ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp()}>
            <span className="section-tag"><Crown size={12} /> What We Stand For</span>
            <h2 className="section-title">The <span className="text-gold">Royal Standard</span></h2>
            <p className="section-subtitle mx-auto text-center">
              Six pillars that define every dish we serve, every order we fulfill, and every experience we deliver.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 group hover:border-brand-gold/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-shadow">
                  <Icon size={22} className="text-brand-gold" />
                </div>
                <h4 className="font-brand text-lg text-white mb-2">{title}</h4>
                <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-20 px-4 text-center" style={{ background: 'var(--green-dark)' }}>
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp()}>
            <Crown size={36} className="text-brand-gold mx-auto mb-4" />
            <h2 className="section-title mb-4">Ready to Taste the Royal Difference?</h2>
            <p className="text-white/55 mb-8">Experience our 50+ handcrafted dishes or claim our exclusive launching deals.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu?category=Deals" className="btn-gold text-base px-8 py-4 shadow-gold-lg flex items-center justify-center gap-2">
                <Flame size={18} className="fill-surface" /> View Launching Deals
              </Link>
              <Link to="/menu" className="btn-outline-gold text-base px-8 py-4 flex items-center justify-center">
                Explore Full Menu <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
