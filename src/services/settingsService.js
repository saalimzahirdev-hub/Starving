// ============================================================
// Settings Service — Restaurant global settings
// ============================================================
const SETTINGS_KEY = 'starving_settings';

const DEFAULT_SETTINGS = {
  restaurantOpen: true,
  deliveryFee: 150,
  minOrderAmount: 500,
  freeDeliveryAbove: 2000,
  taxRate: 0,
  estimatedDeliveryTime: 30,
  notificationsEnabled: true,
  operatingHours: {
    monday:    { open: '12:00', close: '01:00', closed: false },
    tuesday:   { open: '12:00', close: '01:00', closed: false },
    wednesday: { open: '12:00', close: '01:00', closed: false },
    thursday:  { open: '12:00', close: '01:00', closed: false },
    friday:    { open: '12:00', close: '02:00', closed: false },
    saturday:  { open: '12:00', close: '02:00', closed: false },
    sunday:    { open: '12:00', close: '01:00', closed: false },
  },
  contactInfo: {
    phone: '+92 339 666733',
    whatsapp: '+92 339 666733',
    email: 'info@starving.com',
    address: 'Anarkali Plaza Basement, Chungi No 22, Tench Road, Rawalpindi',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Anarkali%20Plaza%20Basement%2C%20Chungi%20No%2022%2C%20Tench%20Road%20Rawalpindi&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  socialLinks: {
    instagram: 'https://instagram.com/strvingpk',
    facebook:  'https://facebook.com/TheStarving',
    tiktok:    '',
  },
  promo: {
    enabled: false,
    code: 'KING10',
    discount: 10,
    type: 'percent', // 'percent' | 'fixed'
  },
};

export const settingsService = {
  get: () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return { ...DEFAULT_SETTINGS };
      const parsed = JSON.parse(stored);
      // Migration: If existing local storage has the old placeholder phone, migrate to new defaults
      if (parsed.contactInfo?.phone === '+92 300 0000000' || !parsed.contactInfo?.phone || parsed.contactInfo?.phone === '+92 339 666733' && !parsed.contactInfo?.mapEmbedUrl) {
        parsed.contactInfo = { ...DEFAULT_SETTINGS.contactInfo };
        parsed.socialLinks = { ...DEFAULT_SETTINGS.socialLinks };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  update: (updates) => {
    const current = settingsService.get();
    const updated = { ...current, ...updates };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('starving:settings_updated', { detail: updated }));
    return updated;
  },

  toggleRestaurant: () => {
    const s = settingsService.get();
    return settingsService.update({ restaurantOpen: !s.restaurantOpen });
  },

  validatePromo: (code) => {
    const s = settingsService.get();
    if (!s.promo.enabled) return null;
    if (code.toUpperCase() === s.promo.code.toUpperCase()) {
      return { code: s.promo.code, discount: s.promo.discount, type: s.promo.type };
    }
    return null;
  },

  reset: () => {
    localStorage.removeItem(SETTINGS_KEY);
    return { ...DEFAULT_SETTINGS };
  },
};
