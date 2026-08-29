import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Crown, Lock, User, ShieldCheck, ChefHat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, loginError, setLoginError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      navigate('/admin/dashboard', { replace: true });
    }
  };

  const handleQuickLogin = (username, password) => {
    setForm({ username, password });
    setLoginError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      setLoading(false);
      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      }
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: `radial-gradient(ellipse at 30% 60%, rgba(0,166,147,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 50%), var(--green-950)`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img
              src="/Logo/gold_logo_transparent.png"
              alt="STARVING"
              className="w-16 object-contain rounded-xl drop-shadow-[0_0_20px_rgba(201,168,76,0.6)]"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <h1 className="font-brand text-3xl text-brand-gold tracking-widest">STARVING</h1>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">Restaurant Staff & Owner Portal</p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/15 flex items-center justify-center text-brand-gold">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm">Authorized Personnel Access</h2>
              <p className="text-white/35 text-[11px]">Customers must order via the customer website</p>
            </div>
          </div>

          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-xs mb-5"
            >
              {loginError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="input-label">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="admin-username"
                  type="text"
                  placeholder="e.g. staff or owner"
                  className="input-field pl-10"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="input-label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="admin-password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="input-field pl-10 pr-10"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="btn-gold w-full justify-center mt-2 py-3 text-sm disabled:opacity-70"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />
              ) : (
                <>
                  <Crown size={15} /> Login to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Role Login for Testing */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
            <p className="text-white/40 text-[11px] uppercase tracking-wider font-semibold text-center">
              Quick Role Test Logins
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('staff', 'Starvingstaff')}
                className="p-3 rounded-xl bg-white/5 border border-brand-gold/20 hover:bg-brand-gold/15 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-brand-gold">
                  <ChefHat size={14} className="text-brand-gold" />
                  Staff
                </div>
                <p className="text-[10px] text-white/40 mt-1 font-mono">staff / Starvingstaff</p>
                <span className="text-[9px] text-green-400 font-semibold mt-0.5 block">View & Manage All Orders</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('owner', 'Starvingowner')}
                className="p-3 rounded-xl bg-white/5 border border-brand-gold/20 hover:bg-brand-gold/15 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-brand-gold">
                  <Crown size={14} className="text-brand-gold" />
                  Owner / Admin
                </div>
                <p className="text-[10px] text-white/40 mt-1 font-mono">owner / Starvingowner</p>
                <span className="text-[9px] text-brand-gold font-semibold mt-0.5 block">Full Restaurant Control</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-white/25 text-xs mt-6">
          STARVING Restaurant Central Management • Staff & Owner Access Only
        </p>
      </motion.div>
    </div>
  );
}
