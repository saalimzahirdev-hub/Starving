import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY = 'starving_auth_session';
const CUSTOMER_ID_KEY = 'starving_customer_id';

export const SYSTEM_ACCOUNTS = [
  {
    id: 'USR-OWNER-01',
    username: 'owner',
    password: 'Starvingowner',
    name: 'Restaurant Owner',
    role: 'owner',
    email: 'owner@starving.pk',
  },
  {
    id: 'USR-ADMIN-01',
    username: 'admin',
    password: 'Starvingadmin',
    name: 'Restaurant Administrator',
    role: 'owner',
    email: 'admin@starving.pk',
  },
  {
    id: 'USR-STAFF-01',
    username: 'staff',
    password: 'Starvingstaff',
    name: 'Floor & Order Staff',
    role: 'staff',
    email: 'staff@starving.pk',
  },
  {
    id: 'USR-STAFF-02',
    username: 'staffonly',
    password: 'Starvingstaff',
    name: 'Kitchen Staff',
    role: 'staff',
    email: 'kitchen@starving.pk',
  },
];

const generateCustomerId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return 'CUST-' + crypto.randomUUID().slice(0, 8).toUpperCase();
  }
  return 'CUST-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // 1. Initialize or load customer ID for this customer device/session
    let currentCustId = localStorage.getItem(CUSTOMER_ID_KEY);
    if (!currentCustId) {
      currentCustId = generateCustomerId();
      localStorage.setItem(CUSTOMER_ID_KEY, currentCustId);
    }
    setCustomerId(currentCustId);

    // 2. Restore staff/owner session from localStorage
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (session?.authenticated && session?.expiresAt > Date.now() && session?.user) {
        setUser(session.user);
      } else {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username, password) => {
    setLoginError('');
    const cleanUser = (username || '').trim().toLowerCase();
    const matched = SYSTEM_ACCOUNTS.find(
      (acc) => acc.username.toLowerCase() === cleanUser && acc.password === password
    );

    if (matched) {
      const userData = {
        id: matched.id,
        username: matched.username,
        name: matched.name,
        role: matched.role, // 'staff' | 'owner'
        email: matched.email,
      };
      const session = {
        authenticated: true,
        user: userData,
        loginAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(userData);
      return { success: true, user: userData };
    } else {
      setLoginError('Invalid username or password. Please check your credentials.');
      return { success: false, error: 'Invalid credentials' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  // Switch simulated customer identity (useful for testing multiple customers in single browser)
  const setSimulatedCustomerId = useCallback((newId) => {
    const formatted = newId.startsWith('CUST-') ? newId : 'CUST-' + newId.toUpperCase();
    localStorage.setItem(CUSTOMER_ID_KEY, formatted);
    setCustomerId(formatted);
    window.dispatchEvent(new CustomEvent('starving:customer_changed', { detail: formatted }));
    return formatted;
  }, []);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) return roles.includes(user.role);
    return user.role === roles;
  }, [user]);

  const isStaff = user?.role === 'staff' || user?.role === 'owner';
  const isOwner = user?.role === 'owner';
  const isCustomer = !user || user?.role === 'customer';
  const currentRole = user?.role || 'customer';
  const isAuthenticated = !!user && (user.role === 'staff' || user.role === 'owner');

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        customerId,
        isAuthenticated,
        isStaff,
        isOwner,
        isCustomer,
        hasRole,
        isLoading,
        loginError,
        login,
        logout,
        setLoginError,
        setSimulatedCustomerId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
