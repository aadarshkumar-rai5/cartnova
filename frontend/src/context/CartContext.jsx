import { createContext, useContext, useEffect, useState } from 'react';
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cartnova-cart') || '[]');
      return Array.isArray(saved)
        ? saved.filter(
            (i) =>
              i?._id &&
              Number.isInteger(i.quantity) &&
              i.quantity > 0 &&
              Number.isFinite(i.price) &&
              Number.isInteger(i.stock) &&
              i.stock >= i.quantity
          )
        : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('cartnova-cart', JSON.stringify(items));
    } catch {
      /* Cart still works when browser storage is unavailable. */
    }
  }, [items]);
  function add(product, quantity = 1) {
    const current = items.find((i) => i._id === product._id)?.quantity || 0;
    if (!Number.isInteger(quantity) || quantity < 1 || current + quantity > product.stock)
      throw new Error('You have reached the available stock.');
    setItems((previous) => {
      const found = previous.find((i) => i._id === product._id);
      return found
        ? previous.map((i) =>
            i._id === product._id
              ? { ...product, quantity: Math.min(product.stock, i.quantity + quantity) }
              : i
          )
        : [...previous, { ...product, quantity }];
    });
  }
  function update(id, quantity) {
    setItems((previous) =>
      previous.map((i) =>
        i._id === id ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) } : i
      )
    );
  }
  const remove = (id) => setItems((previous) => previous.filter((i) => i._id !== id));
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total =
    items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100;
  return (
    <CartContext.Provider
      value={{ items, add, update, remove, count, total, clear: () => setItems([]) }}
    >
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
