import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Crown, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';

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
    await new Promise(r => setTimeout(r, 600));
    const ok = login(form.username, form.password);
    setLoading(false);
    if (ok) navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `radial-gradient(ellipse at 30% 60%, rgba(13,53,32,0.8) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 50%), var(--green-950)`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/Logo/WhatsApp Image 2026-08-23 at 6.04.34 PM.jpeg"
              alt="STARVING"
              className="w-20 object-contain rounded-xl drop-shadow-[0_0_20px_rgba(201,168,76,0.6)]"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <h1 className="font-brand text-3xl text-brand-gold tracking-widest">STARVING</h1>
          <p className="text-white/40 text-sm mt-1">Admin Portal</p>
        </div>

        <div className="glass-card p-7">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/15 flex items-center justify-center">
              <Crown size={14} className="text-brand-gold" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm">Staff Login</h2>
              <p className="text-white/35 text-xs">Authorized personnel only</p>
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
                  placeholder="Enter username"
                  className="input-field pl-10"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
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
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
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
              className="btn-gold w-full justify-center mt-2 disabled:opacity-70"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-surface/40 border-t-surface rounded-full"
                />
              ) : (
                <><Crown size={15} /> Login to Admin</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          STARVING Admin Panel — Authorized Access Only
        </p>

        {/* Demo credentials hint */}
        <div className="mt-4 bg-brand-gold/5 border border-brand-gold/15 rounded-xl p-4">
          <p className="text-brand-gold/60 text-[10px] font-semibold uppercase tracking-wider mb-2">Demo Credentials</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/35">Username</span>
              <span className="text-white/60 font-mono">staffonly</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/35">Password</span>
              <span className="text-white/60 font-mono">Starvingstaff</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
