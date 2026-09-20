import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "buying-cart";

const CartContext = createContext(null);

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage may be unavailable; keep cart in memory
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStorage);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    writeStorage(items);
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.title,
          price: product.price,
          qty: 1,
        },
      ];
    });
  };

  const increment = (id) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );

  const decrement = (id) =>
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    );

  const remove = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const openCart = (rect) => {
    setAnchor(rect ?? null);
    setOpen(true);
  };

  const closeCart = () => setOpen(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      open,
      anchor,
      total,
      addToCart,
      increment,
      decrement,
      remove,
      openCart,
      closeCart,
    }),
    [items, open, anchor, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}