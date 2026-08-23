// Logo component — uses actual brand image
export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm:  { img: 36, text: 'text-lg'  },
    md:  { img: 48, text: 'text-xl'  },
    lg:  { img: 64, text: 'text-2xl' },
    xl:  { img: 96, text: 'text-4xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/images/logo/Screenshot 2026-08-22 112505.png"
        alt="STARVING Logo"
        width={s.img}
        height={s.img}
        className="object-contain drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]"
        loading="lazy"
      />
      {showText && (
        <span
          className={`font-brand ${s.text} tracking-widest`}
          style={{ color: '#c9a84c', textShadow: '0 0 20px rgba(201,168,76,0.3)' }}
        >
          STARVING
        </span>
      )}
    </div>
  );
}
