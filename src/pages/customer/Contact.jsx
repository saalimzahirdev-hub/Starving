import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock, Mail, Send, Instagram, Facebook } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function Contact() {
  const { settings } = useApp();
  const { contactInfo, socialLinks, operatingHours } = settings;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('Please fill in required fields');
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Message sent! We\'ll get back to you soon.', {
      style: { background: '#16211a', color: '#e8f0ec', border: '1px solid rgba(201,168,76,0.3)' },
    });
    setForm({ name: '', email: '', message: '' });
    setSending(false);
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
  });

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div className="text-center py-10" {...fadeUp()}>
          <span className="section-tag">Get in Touch</span>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle mx-auto text-center mt-2">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div className="space-y-5" {...fadeUp(0.1)}>
            {/* Quick Contact */}
            <div className="glass-card p-5 space-y-4">
              <h2 className="font-semibold text-white mb-2">Reach Us Directly</h2>
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">Phone</p>
                  <p className="text-white font-medium text-sm group-hover:text-brand-gold transition-colors">{contactInfo.phone}</p>
                </div>
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp?.replace(/\D/g,'')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">WhatsApp</p>
                  <p className="text-white font-medium text-sm group-hover:text-green-400 transition-colors">Chat with us on WhatsApp</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">Location</p>
                  <p className="text-white/70 text-sm">{contactInfo.address}</p>
                </div>
              </div>
              {contactInfo.email && (
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Email</p>
                    <p className="text-white font-medium text-sm group-hover:text-brand-gold transition-colors">{contactInfo.email}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Social */}
            <div className="glass-card p-5">
              <h2 className="font-semibold text-white mb-4">Follow Us</h2>
              <div className="flex gap-3">
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/55 hover:border-brand-gold hover:text-brand-gold text-sm font-medium transition-all">
                    <Instagram size={15} /> Instagram
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/55 hover:border-brand-gold hover:text-brand-gold text-sm font-medium transition-all">
                    <Facebook size={15} /> Facebook
                  </a>
                )}
              </div>
            </div>

            {/* Hours */}
            <div className="glass-card p-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={15} className="text-brand-gold" /> Operating Hours
              </h2>
              <div className="space-y-2">
                {days.map(day => {
                  const h = operatingHours[day];
                  const isToday = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] === day;
                  return (
                    <div key={day} className={`flex justify-between text-sm py-1 ${isToday ? 'text-brand-gold font-semibold border-b border-brand-gold/20' : 'text-white/50'}`}>
                      <span className="capitalize">{day}</span>
                      <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form + Map */}
          <motion.div className="space-y-5" {...fadeUp(0.15)}>
            {/* Form */}
            <div className="glass-card p-6">
              <h2 className="font-semibold text-white mb-5">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="input-label">Your Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Full name"
                    className="input-field"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="input-label">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    className="input-field"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="input-label">Message *</label>
                  <textarea
                    id="contact-message"
                    placeholder="Your message, feedback or question..."
                    rows={5}
                    className="input-field resize-none"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-gold w-full justify-center disabled:opacity-70"
                  id="contact-submit"
                >
                  {sending ? 'Sending...' : <><Send size={15} /> Send Message</>}
                </button>
              </form>
            </div>

            {/* Map placeholder */}
            <div className="glass-card p-5 overflow-hidden">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin size={15} className="text-brand-gold" /> Find Us
              </h2>
              <div
                className="rounded-xl overflow-hidden flex items-center justify-center"
                style={{ height: 220, background: 'var(--green-dark)', border: '1px solid var(--border-gold)' }}
              >
                {contactInfo.mapEmbedUrl ? (
                  <iframe
                    src={contactInfo.mapEmbedUrl}
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="STARVING location"
                  />
                ) : (
                  <div className="text-center">
                    <MapPin size={32} className="text-brand-gold/40 mx-auto mb-2" />
                    <p className="text-white/40 text-sm">{contactInfo.address}</p>
                    <p className="text-white/25 text-xs mt-1">Map embed coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
