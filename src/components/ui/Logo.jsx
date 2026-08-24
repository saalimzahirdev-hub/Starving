import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// True transparent PNG with ONLY the gold crown & burger emblem
const LOGO_SRC = '/Logo/gold_logo_transparent.png';

/**
 * NavLogo — Navbar logo:
 * - Displays ONLY the shiny golden crown-burger emblem
 * - Hover on desktop: "STARVING" name slides in with golden glow
 * - Click/Tap: toggles name visibility on mobile / navigates to home
 */
export function NavLogo() {
  const [nameVisible, setNameVisible] = useState(false);

  return (
    <Link
      to="/"
      className="inline-flex items-center gap-3 select-none py-1 group"
      onMouseEnter={() => setNameVisible(true)}
      onMouseLeave={() => setNameVisible(false)}
      onClick={(e) => {
        // If on touch device, toggle visibility
        if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
          if (!nameVisible) {
            e.preventDefault();
            setNameVisible(true);
          }
        }
      }}
    >
      {/* Shiny Golden Logo Emblem */}
      <motion.div
        className="relative flex items-center justify-center flex-shrink-0"
        animate={{
          scale: nameVisible ? 1.06 : 1,
          filter: nameVisible
            ? 'drop-shadow(0 0 16px rgba(201,168,76,1)) drop-shadow(0 0 32px rgba(201,168,76,0.7)) brightness(1.15)'
            : 'drop-shadow(0 0 8px rgba(201,168,76,0.65)) brightness(1)',
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={LOGO_SRC}
          alt="STARVING Golden Logo"
          className="w-11 h-11 sm:w-13 sm:h-13 object-contain"
          loading="eager"
        />
      </motion.div>

      {/* STARVING Name - Smooth Animated Reveal */}
      <AnimatePresence>
        {nameVisible && (
          <motion.span
            key="brand-name"
            initial={{ opacity: 0, x: -12, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: -8, width: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="font-brand text-2xl tracking-widest overflow-hidden whitespace-nowrap"
            style={{
              color: '#c9a84c',
              textShadow: '0 0 22px rgba(201,168,76,0.9), 0 0 45px rgba(201,168,76,0.4)',
            }}
          >
            STARVING
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

/**
 * Logo — General-purpose pure golden logo (Admin sidebar, footer, mobile drawer etc.)
 */
export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm:  { img: 36, text: 'text-base'  },
    md:  { img: 48, text: 'text-xl'    },
    lg:  { img: 64, text: 'text-2xl'   },
    xl:  { img: 96, text: 'text-4xl'   },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={LOGO_SRC}
        alt="STARVING Golden Emblem"
        width={s.img}
        height={s.img}
        className="object-contain flex-shrink-0"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.7))',
        }}
        loading="lazy"
      />
      {showText && (
        <span
          className={`font-brand ${s.text} tracking-widest`}
          style={{ color: '#c9a84c', textShadow: '0 0 20px rgba(201,168,76,0.35)' }}
        >
          STARVING
        </span>
      )}
    </div>
  );
}
