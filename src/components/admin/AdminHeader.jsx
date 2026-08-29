import { useState } from 'react';
import { Menu, Bell, Volume2, VolumeX, Crown, ChefHat } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function AdminHeader({ title, onMenuClick }) {
  const { unreadCount, soundEnabled, toggleSound } = useOrders();
  const { settings } = useApp();
  const { user, isOwner } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      className="h-14 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-30"
      style={{
        background: 'rgba(10,35,24,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="icon-btn lg:hidden" aria-label="Open navigation menu">
          <Menu size={16} />
        </button>
        <h1 className="font-semibold text-white text-base sm:text-lg tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold">
          {isOwner ? <Crown size={12} /> : <ChefHat size={12} />}
          <span>{isOwner ? 'Owner' : 'Staff'}</span>
        </div>

        {/* Restaurant status badge */}
        <div
          className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
            settings?.restaurantOpen !== false
              ? 'text-green-400 border-green-500/30 bg-green-500/10'
              : 'text-red-400 border-red-500/30 bg-red-500/10'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              settings?.restaurantOpen !== false ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`}
          />
          {settings?.restaurantOpen !== false ? 'Open' : 'Closed'}
        </div>

        {/* Audio Chime Toggle */}
        <button
          onClick={toggleSound}
          className={`icon-btn text-xs transition-all ${
            soundEnabled
              ? 'text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20'
              : 'text-white/40 hover:text-white'
          }`}
          title={soundEnabled ? 'Order Bell Sound: ON' : 'Order Bell Sound: OFF'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Live notification bell */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`icon-btn relative transition-all ${
              dropdownOpen
                ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/40'
                : unreadCount > 0
                ? 'text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20'
                : 'text-white/70 hover:text-white'
            }`}
            aria-label="Order notifications"
            title="Order Notifications"
          >
            <Bell size={17} className={unreadCount > 0 ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-[#111815] shadow-lg animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          <NotificationDropdown open={dropdownOpen} onClose={() => setDropdownOpen(false)} />
        </div>
      </div>
    </header>
  );
}
