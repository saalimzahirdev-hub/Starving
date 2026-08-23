import { Menu, Bell } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useApp } from '../../context/AppContext';

export default function AdminHeader({ title, onMenuClick }) {
  const { orders } = useOrders();
  const { settings } = useApp();
  const pendingCount = orders.filter(o => o.status === 'received').length;

  return (
    <header
      className="h-14 flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-30"
      style={{ background: 'rgba(10,35,24,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="icon-btn lg:hidden">
          <Menu size={16} />
        </button>
        <h1 className="font-semibold text-white text-base">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Restaurant status badge */}
        <div className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
          settings.restaurantOpen
            ? 'text-green-400 border-green-500/30 bg-green-500/10'
            : 'text-red-400 border-red-500/30 bg-red-500/10'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${settings.restaurantOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          {settings.restaurantOpen ? 'Open' : 'Closed'}
        </div>
        {/* Pending orders bell */}
        <div className="relative">
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={16} />
          </button>
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
              {pendingCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
