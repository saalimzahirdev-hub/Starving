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
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2.5 sm:gap-3 select-none py-1 group"
    >
      {/* Shiny Golden Logo Emblem */}
      <motion.div
        className="relative flex items-center justify-center flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={LOGO_SRC}
          alt="STARVING Golden Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:brightness-110 transition-all"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.65))',
          }}
          loading="eager"
        />
      </motion.div>

      {/* STARVING Name - Permanent with logo */}
      <span
        className="font-brand text-xl sm:text-2xl tracking-widest whitespace-nowrap"
        style={{
          color: '#c9a84c',
          textShadow: '0 0 20px rgba(201,168,76,0.5), 0 0 40px rgba(201,168,76,0.25)',
        }}
      >
        STARVING
      </span>
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
