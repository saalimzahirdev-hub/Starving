import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, User, MessageSquare, Crown, CheckCircle, Clock, ThumbsUp } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

function StarRating({ rating, setRating, interactive = false, size = 20 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-all duration-150 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Star
            size={size}
            className={`transition-colors ${
              (hover || rating) >= star
                ? 'text-brand-gold fill-brand-gold'
                : 'text-white/20'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, avgRating: '0.0' });
  const [form, setForm] = useState({ name: '', rating: 5, text: '', orderItem: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const refresh = () => {
    setReviews(reviewService.getApproved());
    setStats(reviewService.getStats());
  };

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener('starving:reviews_updated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'starving_reviews') refresh();
    });

    // BroadcastChannel
    let channel = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('starving_reviews_channel');
        channel.onmessage = () => refresh();
      }
    } catch { /* ignore */ }

    return () => {
      window.removeEventListener('starving:reviews_updated', handleUpdate);
      if (channel) channel.close();
    };
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Your name is required';
    if (!form.text.trim()) e.text = 'Please write your review';
    if (form.text.trim().length < 10) e.text = 'Review must be at least 10 characters';
    if (form.rating < 1 || form.rating > 5) e.rating = 'Please select a rating';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    reviewService.submit({
      name: form.name.trim(),
      rating: form.rating,
      text: form.text.trim(),
      orderItem: form.orderItem.trim(),
    });

    setSubmitting(false);
    setSubmitted(true);
    setForm({ name: '', rating: 5, text: '', orderItem: '' });

    toast.success('Thank you! Your review has been submitted for approval.', {
      style: { background: '#16211a', color: '#e8f0ec', border: '1px solid rgba(201,168,76,0.3)' },
      iconTheme: { primary: '#c9a84c', secondary: '#00A693' },
      duration: 5000,
    });

    setTimeout(() => setSubmitted(false), 8000);
  };

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { if (counts[r.rating] !== undefined) counts[r.rating]++; });
    return counts;
  }, [reviews]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ══ HERO ══ */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden pt-28 pb-16"
        style={{
          background: `linear-gradient(to bottom, rgba(6,22,16,0.6) 0%, rgba(6,22,16,1) 100%), url('/Theme/Gemini_Generated_Image_9n42wn9n42wn9n42.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-4 max-w-3xl mx-auto"
        >
          <span className="section-tag"><Star size={12} className="fill-brand-gold" /> Customer Reviews</span>
          <h1 className="font-brand text-4xl sm:text-5xl tracking-wider mb-4" style={{ color: '#c9a84c', textShadow: '0 0 40px rgba(201,168,76,0.3)' }}>
            What Our <span className="italic font-playfair">Kings</span> Say
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Real reviews from real customers. Your feedback helps us serve you better.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="glass-card px-5 py-3 flex items-center gap-3">
              <div className="text-center">
                <p className="font-brand text-2xl text-brand-gold">{stats.avgRating || '0.0'}</p>
                <StarRating rating={Math.round(parseFloat(stats.avgRating) || 0)} size={12} />
              </div>
              <div className="text-left">
                <p className="text-white/80 text-sm font-semibold">Average Rating</p>
                <p className="text-white/40 text-xs">{stats.approved} verified reviews</p>
              </div>
            </div>
            {Object.entries(ratingCounts).reverse().map(([star, count]) => (
              <div key={star} className="hidden sm:flex items-center gap-2 text-xs text-white/50">
                <span className="text-brand-gold font-bold">{star}★</span>
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-gold rounded-full transition-all"
                    style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                  />
                </div>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ SUBMIT REVIEW FORM ══ */}
      <section className="py-16 px-4" style={{ background: 'var(--green-dark)' }}>
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <h2 className="section-title">Share Your <span className="text-gold">Experience</span></h2>
            <p className="text-white/60 text-sm mt-2">Your review will be published after admin approval.</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8 text-center border-green-500/30"
              >
                <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                <h3 className="font-brand text-2xl text-white mb-2">Thank You, Your Highness! 👑</h3>
                <p className="text-white/60 text-sm">Your review has been submitted and is pending admin approval. It will appear here once approved.</p>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-white/40">
                  <Clock size={12} />
                  <span>Reviews are typically approved within 24 hours</span>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="glass-card p-6 sm:p-8 space-y-5"
              >
                {/* Name */}
                <div>
                  <label className="input-label">Your Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      className={`input-field pl-10 ${errors.name ? 'border-red-500/50' : ''}`}
                      placeholder="e.g. Ahmed Khan"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* What did you order? */}
                <div>
                  <label className="input-label">What did you order? (optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Colossal Crunch Burger, Boom Boom Roll"
                    value={form.orderItem}
                    onChange={e => setForm(f => ({ ...f, orderItem: e.target.value }))}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="input-label mb-2 block">Your Rating *</label>
                  <div className="flex items-center gap-3">
                    <StarRating rating={form.rating} setRating={(r) => setForm(f => ({ ...f, rating: r }))} interactive size={28} />
                    <span className="text-brand-gold font-brand text-lg">{form.rating}.0</span>
                  </div>
                  {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
                </div>

                {/* Review Text */}
                <div>
                  <label className="input-label">Your Review *</label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-white/30" />
                    <textarea
                      className={`input-field pl-10 min-h-[120px] resize-y ${errors.text ? 'border-red-500/50' : ''}`}
                      placeholder="Tell us about your experience — the food, the flavors, the delivery..."
                      value={form.text}
                      onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    />
                  </div>
                  {errors.text && <p className="text-red-400 text-xs mt-1">{errors.text}</p>}
                  <p className="text-white/30 text-xs mt-1">{form.text.length} characters</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full justify-center py-3.5 text-base gap-2"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block">
                        ⏳
                      </motion.span>
                      Submitting...
                    </span>
                  ) : (
                    <>
                      <Send size={16} /> Submit Your Royal Review
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══ APPROVED REVIEWS ══ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp()}>
            <span className="section-tag"><ThumbsUp size={12} /> Verified Reviews</span>
            <h2 className="section-title">From Our Royal <span className="text-gold">Customers</span></h2>
          </motion.div>

          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 glass-card max-w-md mx-auto"
            >
              <Star size={48} className="text-white/20 mx-auto mb-4" />
              <h3 className="font-brand text-xl text-white/50 mb-2">No Reviews Yet</h3>
              <p className="text-white/35 text-sm">Be the first to share your experience! Scroll up to submit your review.</p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`glass-card p-5 ${r.isFeatured ? 'border-brand-gold/40 shadow-[0_0_15px_rgba(201,168,76,0.15)]' : ''}`}
                >
                  {r.isFeatured && (
                    <div className="flex items-center gap-1.5 text-brand-gold text-[10px] font-bold uppercase tracking-wider mb-3">
                      <Crown size={11} /> Featured Review
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center text-brand-gold font-bold text-sm">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{r.name}</p>
                        {r.orderItem && <p className="text-white/40 text-[10px]">Ordered: {r.orderItem}</p>}
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={12} />
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed italic">"{r.text}"</p>
                  <p className="text-white/25 text-[10px] mt-3">
                    {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
