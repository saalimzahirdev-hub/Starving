// ============================================================
// Menu Service — CRUD with localStorage
// Firebase-ready structure (swap localStorage calls with Firestore)
// ============================================================
import { menuData as defaultMenuData } from '../data/menuData';

const MENU_KEY = 'starving_menu';

const initMenu = () => {
  const stored = localStorage.getItem(MENU_KEY);
  if (!stored) {
    localStorage.setItem(MENU_KEY, JSON.stringify(defaultMenuData));
    return defaultMenuData;
  }
  try {
    const parsed = JSON.parse(stored);
    // Obsolete IDs to remove if merging happened
    const obsoleteIds = new Set(['cold-drink-15l', 'cold-drink-500ml', 'cold-drink-reg', 'reg-fries', 'large-fries', 'family-fries']);
    
    // Filter out obsolete/removed items
    let filtered = parsed.filter(item => !obsoleteIds.has(item.id));

    let hasUpdates = false;
    if (filtered.length !== parsed.length) {
      hasUpdates = true;
    }

    const defaultMap = new Map(defaultMenuData.map(d => [d.id, d]));
    const migrated = filtered.map(item => {
      const def = defaultMap.get(item.id);
      if (def) {
        // Sync image, variants, name, description if updated
        if (item.image !== def.image || item.image.includes('menu_crops') || item.image.includes('Screenshot') || item.variants.length !== def.variants.length) {
          hasUpdates = true;
          return { ...item, image: def.image, name: def.name, description: def.description, variants: def.variants, addons: def.addons };
        }
      }
      return item;
    });

    // Check if new items in defaultMenuData are missing in stored
    defaultMenuData.forEach(def => {
      if (!migrated.some(m => m.id === def.id)) {
        migrated.push(def);
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      localStorage.setItem(MENU_KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch {
    localStorage.setItem(MENU_KEY, JSON.stringify(defaultMenuData));
    return defaultMenuData;
  }
};

const save = (items) => localStorage.setItem(MENU_KEY, JSON.stringify(items));

export const menuService = {
  getAll: () => initMenu(),

  getById: (id) => initMenu().find(item => item.id === id) || null,

  getByCategory: (category) => {
    const items = initMenu();
    if (category === 'all') return items;
    return items.filter(item => item.category === category);
  },

  getDeals: () => initMenu().filter(item => item.category === 'Deals' || item.isLaunchingDeal),

  getAvailable: () => initMenu().filter(item => item.isAvailable),

  create: (item) => {
    const items = initMenu();
    const newItem = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    save(items);
    return newItem;
  },

  update: (id, updates) => {
    const items = initMenu();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
    save(items);
    return items[idx];
  },

  toggleAvailability: (id) => {
    const items = initMenu();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx].isAvailable = !items[idx].isAvailable;
    save(items);
    return items[idx];
  },

  delete: (id) => {
    const items = initMenu().filter(i => i.id !== id);
    save(items);
    return true;
  },

  reorder: (orderedIds) => {
    const items = initMenu();
    const ordered = orderedIds
      .map(id => items.find(i => i.id === id))
      .filter(Boolean);
    save(ordered);
    return ordered;
  },

  reset: () => {
    save(defaultMenuData);
    return defaultMenuData;
  },
};
