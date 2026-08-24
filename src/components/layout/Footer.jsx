import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import Logo from '../ui/Logo';
import { useApp } from '../../context/AppContext';

const quickLinks = [
  { to: '/',              label: 'Home'          },
  { to: '/menu',          label: 'Menu'          },
  { to: '/our-story',     label: 'Our Story'     },
  { to: '/reviews',       label: 'Reviews'       },
  { to: '/cart',          label: 'Cart'          },
  { to: '/contact',       label: 'Contact Us'    },
  { to: '/track-order',   label: 'Track Order'   },
];

export default function Footer() {
  const { settings } = useApp();
  const { contactInfo, socialLinks, operatingHours } = settings;

  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <footer className="relative border-t overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.12)', background: 'var(--green-950)' }}>
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0d3520 0%, transparent 60%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand col */}
          <div className="lg:col-span-1">
            <Logo size="md" className="mb-4" />
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              "Satisfy the king in you." We bring premium flavors straight to your door — because royalty deserves the best.
            </p>
            <div className="flex gap-3">
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/50 hover:border-brand-gold hover:text-brand-gold transition-all">
                  <Instagram size={16} />
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/50 hover:border-brand-gold hover:text-brand-gold transition-all">
                  <Facebook size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/50 hover:text-brand-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="text-sm text-white/55 hover:text-white transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <a href={`https://wa.me/${contactInfo.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-white/55 hover:text-green-400 transition-colors">
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/55">{contactInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Opening Hours</h4>
            <ul className="space-y-2">
              {days.map(day => {
                const h = operatingHours[day];
                const isToday = day === today;
                return (
                  <li key={day} className={`flex justify-between text-xs ${isToday ? 'text-brand-gold font-semibold' : 'text-white/45'}`}>
                    <span className="capitalize">{day.slice(0,3)}</span>
                    <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="gold-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} STARVING. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Tagline: Satisfy the king in you 👑
          </p>
        </div>
      </div>
    </footer>
  );
}
