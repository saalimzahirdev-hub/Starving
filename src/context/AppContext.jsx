import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => settingsService.get());

  useEffect(() => {
    const handleUpdate = (e) => setSettings(e.detail);
    const handleStorage = (e) => {
      if (e.key === 'starving_settings') {
        setSettings(settingsService.get());
      }
    };
    window.addEventListener('starving:settings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('starving:settings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateSettings = useCallback((updates) => {
    const updated = settingsService.update(updates);
    setSettings(updated);
    return updated;
  }, []);

  const toggleRestaurant = useCallback(() => {
    const updated = settingsService.toggleRestaurant();
    setSettings(updated);
    return updated;
  }, []);

  return (
    <AppContext.Provider value={{ settings, updateSettings, toggleRestaurant }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
