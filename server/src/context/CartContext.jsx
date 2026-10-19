import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
const DELIVERY_FEE = 150;
const FREE_ABOVE = 2500;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem('zaiqa_cart');
    return raw ? JSON.parse(raw) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('zaiqa_cart', JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i._id === product._id);
      if (found) {
        return prev.map((i) => (i._id === product._id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { _id: product._id, name: product.name, price: product.price, image: product.image, qty }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return remove(id);
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, qty } : i)));
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((a, i) => a + i.price * i.qty, 0), [items]);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_ABOVE ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const count = items.reduce((a, i) => a + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, add, updateQty, remove, clear, subtotal, deliveryFee, total, count, isOpen, setIsOpen, FREE_ABOVE }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
