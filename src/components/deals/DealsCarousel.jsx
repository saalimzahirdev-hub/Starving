import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dealsData } from '../../data/dealsData';

// Slide animation variants for smooth horizontal direction-aware transition
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 280, damping: 30, duration: 0.55 },
      opacity: { duration: 0.35 },
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 280, damping: 30, duration: 0.55 },
      opacity: { duration: 0.35 },
    },
  }),
};

export default function DealsCarousel({ onDealClick }) {
  // Use all 5 promotional images from dealsData
  const slides = dealsData.slice(0, 5);
  const totalSlides = slides.length;

  const [[currentIndex, direction], setPage] = useState([0, 1]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Pagination navigation
  const paginate = useCallback((newDirection) => {
    setPage(([prevIndex]) => {
      const nextIndex = (prevIndex + newDirection + totalSlides) % totalSlides;
      return [nextIndex, newDirection];
    });
  }, [totalSlides]);

  const goToSlide = (slideIndex) => {
    if (slideIndex === currentIndex) return;
    const newDirection = slideIndex > currentIndex ? 1 : -1;
    setPage([slideIndex, newDirection]);
  };

  // ── Permanent 3-second auto-slide interval (continuous uninterrupted loop) ──
  useEffect(() => {
    if (totalSlides === 0) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 3000); // 3 seconds permanent continuous slide motion

    return () => clearInterval(interval);
  }, [currentIndex, paginate, totalSlides]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // 45px swipe threshold

    if (touchEndX.current > 0) {
      if (distance > minSwipeDistance) {
        // Swiped Left -> Next slide
        paginate(1);
      } else if (distance < -minSwipeDistance) {
        // Swiped Right -> Prev slide
        paginate(-1);
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const currentDeal = slides[currentIndex] || slides[0];

  return (
    <div
      className="relative w-full bg-[#121617] overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Royal Persian Green & Gold Geometric Theme Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-85"
        style={{
          backgroundImage: `url('/Theme/Gemini_Generated_Image_9n42wn9n42wn9n42.jpg')`,
          backgroundPosition: 'center 30%',
        }}
      />

      {/* ── Ambient Glow & Edge Vignette ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#051815]/50 via-transparent to-[#121617] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,24,21,0.65)_85%,rgba(18,22,23,0.95)_100%)] pointer-events-none" />

      {/* ── Carousel Banner Container (Mobile responsive heights) ── */}
      <div className="relative z-10 w-full h-[300px] sm:h-[420px] md:h-[500px] lg:h-[580px] xl:h-[640px] flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {/* Ambient natural image glow matching current deal flyer */}
            {currentDeal?.image && (
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-25 scale-105 pointer-events-none"
                style={{ backgroundImage: `url('${currentDeal.image}')` }}
              />
            )}

            {/* Main Promotional Deal Image */}
            {currentDeal?.image && (
              <img
                src={currentDeal.image}
                alt={currentDeal.name || `Deal ${currentIndex + 1}`}
                className="relative z-10 w-full h-full object-contain object-center drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)] cursor-pointer"
                onClick={() => onDealClick && onDealClick(currentDeal)}
                loading="eager"
                draggable={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Left Navigation Arrow (Mobile tuned) ── */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            paginate(-1);
          }}
          className="absolute left-2 sm:left-6 z-20 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-black/60 hover:bg-brand-gold text-white hover:text-surface border border-white/20 hover:border-brand-gold flex items-center justify-center transition-all duration-200 shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 group focus:outline-none"
          aria-label="Previous Deal Banner"
        >
          <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* ── Right Navigation Arrow (Mobile tuned) ── */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            paginate(1);
          }}
          className="absolute right-2 sm:right-6 z-20 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-black/60 hover:bg-brand-gold text-white hover:text-surface border border-white/20 hover:border-brand-gold flex items-center justify-center transition-all duration-200 shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 group focus:outline-none"
          aria-label="Next Deal Banner"
        >
          <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* ── Pagination Dots Indicator ── */}
        {totalSlides > 0 && (
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2.5 bg-black/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/15 backdrop-blur-md shadow-2xl">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(i);
                }}
                className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                  currentIndex === i
                    ? 'w-5 sm:w-8 bg-brand-gold shadow-[0_0_10px_rgba(201,168,76,1)]'
                    : 'w-1.5 sm:w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
