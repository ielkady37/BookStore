import { createContext, useContext, useState, ReactNode } from "react";
import { Book, CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (isbn: string) => void;
  updateQuantity: (isbn: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  // Fixed: Uses 'selling_price' to match DB
  const total = items.reduce(
    (acc, item) => acc + item.book.selling_price * item.quantity,
    0
  );

  const addToCart = (book: Book) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.book.isbn === book.isbn
      );

      if (existingItem) {
        toast({
          title: "Updated Cart",
          description: `Increased quantity of "${book.title}"`,
        });
        return prevItems.map((item) =>
          item.book.isbn === book.isbn
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      toast({
        title: "Added to Cart",
        description: `"${book.title}" added to your cart`,
      });
      // Fixed: Pushes nested { book, quantity } object which matches type now
      return [...prevItems, { book, quantity: 1 }];
    });
  };

  const removeFromCart = (isbn: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.book.isbn !== isbn)
    );
    toast({
      title: "Removed from Cart",
      description: "Item removed successfully",
    });
  };

  const updateQuantity = (isbn: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(isbn);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.book.isbn === isbn ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
