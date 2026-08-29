import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Phone, MapPin } from 'lucide-react';
import Logo, { NavLogo } from '../ui/Logo';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';

const navLinks = [
  { to: '/',                    label: 'Home'        },
  { to: '/menu?category=Deals', label: '🔥 Deals',    isDeal: true },
  { to: '/menu',                label: 'Menu'        },
  { to: '/track-order',         label: 'Track Order' },
  { to: '/our-story',           label: 'Our Story'   },
  { to: '/reviews',             label: '⭐ Reviews'   },
  { to: '/contact',             label: 'Contact'     },
];

export default function Navbar() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { settings } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isActive = (to) => {
    if (to.includes('?')) {
      return location.pathname + location.search === to;
    }
    return location.pathname === to && (!location.search || to !== '/menu');
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(10,38,34,0.96)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLogo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-sm font-medium transition-colors duration-200"
                style={{ color: isActive(link.to) ? '#c9a84c' : 'rgba(232,240,236,0.75)' }}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: '#c9a84c' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Restaurant status */}
            {!settings.restaurantOpen && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-red-400 border border-red-500/30 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Closed
              </span>
            )}

            {/* Cart — desktop */}
            <Link
              to="/cart"
              className="hidden md:flex relative items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white/5"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} style={{ color: itemCount > 0 ? '#c9a84c' : 'rgba(232,240,236,0.7)' }} />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-brand-gold text-surface text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </motion.span>
              )}
            </Link>

            {/* Order Now — desktop */}
            <Link to="/menu" className="btn-gold hidden md:flex text-xs py-2 px-4">
              Order Now
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden icon-btn"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-40 w-72 flex flex-col"
            style={{ background: 'rgba(10,35,24,0.98)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(201,168,76,0.15)' }}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <Logo size="sm" />
              <button onClick={() => setMobileOpen(false)} className="icon-btn">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-1 p-4 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/20'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-white/5">
              <Link to="/menu" className="btn-gold w-full justify-center">
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
