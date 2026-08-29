/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand greens (Persian Green #00A693)
        'brand-green': {
          50:  '#e6faf7',
          100: '#bff0e8',
          200: '#7fe0d0',
          300: '#43cbb4',
          400: '#1ab69d',
          500: '#00a693',
          600: '#009584',
          700: '#008b7a',
          800: '#007063',
          900: '#00594e',
          950: '#003b34',
          DEFAULT: '#00a693',
          dark: '#008b7a',
          darker: '#004d44',
        },
        // Royal golds
        'brand-gold': {
          light: '#e8c97a',
          DEFAULT: '#c9a84c',
          dark: '#a8882e',
          900: '#7a6020',
        },
        // Surface colors (Charcoal - 100% UNCHANGED)
        'surface': {
          DEFAULT: '#111815',
          card: '#16211a',
          hover: '#1c2b22',
          border: 'rgba(201,168,76,0.15)',
          glass: 'rgba(0, 166, 147, 0.25)',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)',
        'green-gradient': 'linear-gradient(135deg, #00a693 0%, #008b7a 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(0,59,52,0.85) 0%, rgba(0,36,32,0.92) 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(0,36,32,0.3) 0%, rgba(0,36,32,0.7) 60%, rgba(18,22,23,1) 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201,168,76,0.2)',
        'gold-lg': '0 0 40px rgba(201,168,76,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0,0,.2,1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(201,168,76,0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(201,168,76,0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
