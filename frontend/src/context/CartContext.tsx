import React, { createContext, useContext, useState, useCallback } from 'react';
import { Book, CartItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (isbn: string) => void;
  updateQuantity: (isbn: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((book: Book, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.book.isbn === book.isbn);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, book.quantity);
        toast.success(`Updated "${book.title}" quantity in cart`);
        return prev.map((item) =>
          item.book.isbn === book.isbn ? { ...item, quantity: newQty } : item
        );
      }
      toast.success(`Added "${book.title}" to cart`);
      return [...prev, { book, quantity: Math.min(quantity, book.quantity) }];
    });
  }, []);

  const removeFromCart = useCallback((isbn: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.book.isbn === isbn);
      if (item) {
        toast.info(`Removed "${item.book.title}" from cart`);
      }
      return prev.filter((item) => item.book.isbn !== isbn);
    });
  }, []);

  const updateQuantity = useCallback((isbn: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(isbn);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.book.isbn === isbn
          ? { ...item, quantity: Math.min(quantity, item.book.quantity) }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info('Cart cleared');
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
