import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CART_KEY = 'starving_cart';

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, variant, selectedAddons = [], qty = 1) => {
    const cartItemId = `${product.id}-${variant.size}-${selectedAddons.map(a => a.id).join('-')}`;
    setItems(prev => {
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map(i =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
      return [...prev, {
        cartItemId,
        productId: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        size: variant.size,
        sizeLabel: variant.label,
        price: variant.price + addonTotal,
        basePrice: variant.price,
        originalPrice: variant.originalPrice,
        addons: selectedAddons,
        quantity: qty,
      }];
    });
    toast.success(`${product.name} (${variant.size}) added to cart!`, {
      style: { background: '#16211a', color: '#e8f0ec', border: '1px solid rgba(201,168,76,0.3)' },
      iconTheme: { primary: '#c9a84c', secondary: '#0d3520' },
    });
  }, []);

  const removeItem = useCallback((cartItemId) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  }, []);

  const updateQty = useCallback((cartItemId, qty) => {
    if (qty < 1) {
      setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
      return;
    }
    setItems(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedPromo(null);
    localStorage.removeItem(CART_KEY);
  }, []);

  const applyPromo = useCallback((code) => {
    const result = settingsService.validatePromo(code);
    if (result) {
      setAppliedPromo(result);
      toast.success(`Promo "${result.code}" applied! ${result.type === 'percent' ? result.discount + '%' : 'PKR ' + result.discount} off`, {
        style: { background: '#16211a', color: '#e8f0ec', border: '1px solid rgba(201,168,76,0.3)' },
      });
      return true;
    } else {
      toast.error('Invalid promo code', {
        style: { background: '#16211a', color: '#e8f0ec' },
      });
      return false;
    }
  }, []);

  const removePromo = useCallback(() => setAppliedPromo(null), []);

  // Computed values
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const settings = settingsService.get();
  const deliveryFee = subtotal >= settings.freeDeliveryAbove ? 0 : settings.deliveryFee;
  let promoDiscount = 0;
  if (appliedPromo) {
    promoDiscount = appliedPromo.type === 'percent'
      ? Math.round(subtotal * appliedPromo.discount / 100)
      : appliedPromo.discount;
  }
  const total = Math.max(0, subtotal + deliveryFee - promoDiscount);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, itemCount, subtotal, deliveryFee, promoDiscount, total,
      appliedPromo, settings,
      addItem, removeItem, updateQty, clearCart, applyPromo, removePromo,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
