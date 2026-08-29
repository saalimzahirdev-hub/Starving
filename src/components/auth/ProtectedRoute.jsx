import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = ['staff', 'owner'] }) {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Verifying access authorization...</p>
        </div>
      </div>
    );
  }

  // If not authenticated as staff or owner, deny access and redirect to Admin Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // If authenticated but current role does not have permission for this route
  if (!hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="glass-card max-w-md w-full p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-white/60 text-sm">
            Your current role (<span className="text-brand-gold font-mono uppercase font-bold">{user.role}</span>) does not have permission to view this section.
          </p>
          <p className="text-white/40 text-xs">
            Required permissions: <span className="font-mono text-white/70">{Array.isArray(allowedRoles) ? allowedRoles.join(', ') : allowedRoles}</span>
          </p>
          <div className="pt-3 flex flex-col gap-2.5">
            <Link to="/admin/dashboard" className="btn-gold justify-center text-xs py-2.5 flex items-center gap-2">
              <LayoutDashboard size={14} /> Back to Staff Dashboard
            </Link>
            <Link to="/" className="text-xs text-white/40 hover:text-white transition-colors flex items-center justify-center gap-1">
              <ArrowLeft size={12} /> Go to Customer Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
