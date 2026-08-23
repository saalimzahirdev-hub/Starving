import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatsCard({ label, value, sub, icon: Icon, trend, color = 'gold' }) {
  const colors = {
    gold:   { bg: 'bg-brand-gold/12',   border: 'border-brand-gold/20',   icon: 'text-brand-gold'  },
    green:  { bg: 'bg-green-500/12',    border: 'border-green-500/20',    icon: 'text-green-400'   },
    blue:   { bg: 'bg-blue-500/12',     border: 'border-blue-500/20',     icon: 'text-blue-400'    },
    orange: { bg: 'bg-orange-500/12',   border: 'border-orange-500/20',   icon: 'text-orange-400'  },
    red:    { bg: 'bg-red-500/12',      border: 'border-red-500/20',      icon: 'text-red-400'     },
    purple: { bg: 'bg-purple-500/12',   border: 'border-purple-500/20',   icon: 'text-purple-400'  },
  };
  const c = colors[color] || colors.gold;
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <div className={`glass-card p-5 border ${c.border}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon size={18} className={c.icon} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-white/30'}`}>
            <TrendIcon size={12} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="font-brand text-2xl text-white mb-1">{value}</p>
      <p className="text-sm text-white/55 font-medium">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
    </div>
  );
}
