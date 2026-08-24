import { useLocation, Link } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingCart, MapPin, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const tabs = [
  { to: '/',                    label: 'Home',    Icon: Home           },
  { to: '/menu?category=Deals', label: 'Deals',   Icon: Flame          },
  { to: '/menu',                label: 'Menu',    Icon: UtensilsCrossed },
  { to: '/cart',                label: 'Cart',    Icon: ShoppingCart   },
  { to: '/track-order',         label: 'Track',   Icon: MapPin         },
];


export default function MobileNav() {
  const location = useLocation();
  const { itemCount } = useCart();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden flex items-center justify-around px-2 h-16"
      style={{
        background: 'rgba(10,38,34,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(201,168,76,0.15)',
      }}
    >
      {tabs.map(({ to, label, Icon }) => {
        const active = to.includes('?')
          ? (location.pathname + location.search === to)
          : (location.pathname === to && (!location.search || to !== '/menu'));
        const showBadge = to === '/cart' && itemCount > 0;
        return (
          <Link
            key={to}
            to={to}
            className="relative flex flex-col items-center gap-0.5 flex-1 py-2"
          >
            <div className="relative">
              <Icon
                size={22}
                style={{ color: active ? '#c9a84c' : 'rgba(232,240,236,0.4)', transition: 'all 0.2s' }}
                strokeWidth={active ? 2.5 : 1.8}
              />
              {showBadge && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-brand-gold text-surface text-[9px] font-bold rounded-full flex items-center justify-center px-0.5"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </div>
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? '#c9a84c' : 'rgba(232,240,236,0.4)', transition: 'color 0.2s' }}
            >
              {label}
            </span>
            {active && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute top-0 inset-x-0 h-0.5 rounded-b-full"
                style={{ background: '#c9a84c' }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
