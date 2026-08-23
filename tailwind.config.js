/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand greens
        'brand-green': {
          50:  '#e8f5ee',
          100: '#c5e4d0',
          200: '#9fd1af',
          300: '#75be8d',
          400: '#52af72',
          500: '#2e9f57',
          600: '#27904e',
          700: '#1e7d43',
          800: '#166b38',
          900: '#0d4a27',
          950: '#0a2e1a',
          DEFAULT: '#0d3520',
          dark: '#0a2318',
          darker: '#061610',
        },
        // Royal golds
        'brand-gold': {
          light: '#e8c97a',
          DEFAULT: '#c9a84c',
          dark: '#a8882e',
          900: '#7a6020',
        },
        // Surface colors
        'surface': {
          DEFAULT: '#111815',
          card: '#16211a',
          hover: '#1c2b22',
          border: 'rgba(201,168,76,0.15)',
          glass: 'rgba(13,53,32,0.6)',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)',
        'green-gradient': 'linear-gradient(135deg, #0d3520 0%, #1a5c35 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(26,44,34,0.8) 0%, rgba(13,35,24,0.9) 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(6,22,16,0.3) 0%, rgba(6,22,16,0.7) 60%, rgba(6,22,16,1) 100%)',
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
