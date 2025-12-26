import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { Book, CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cartApi } from "@/services/api";
import { useAuth } from "./AuthContext";

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
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce(
    (acc, item) => acc + Number(item.book.selling_price) * item.quantity,
    0
  );

  // Transform API response to CartItem format
  const transformCartItems = (apiItems: any[]): CartItem[] => {
    return apiItems.map((item) => ({
      book: {
        isbn: item.isbn,
        title: item.title,
        selling_price: item.selling_price,
        publication_year: item.publication_year,
        category: item.category,
        publisher_name: item.publisher_name,
        authors: item.authors,
        stock_quantity: item.stock_quantity,
        threshold: item.threshold,
      },
      quantity: item.quantity,
    }));
  };

  // Fetch cart from API
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await cartApi.getCart();
      const cartItems = transformCartItems(response.data.data.items || []);
      setItems(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load cart on auth change
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (book: Book) => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await cartApi.addToCart(book.isbn);
      const cartItems = transformCartItems(response.data.data.items || []);
      setItems(cartItems);

      toast({
        title: "Added to Cart",
        description: `"${book.title}" added to your cart`,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (isbn: string) => {
    try {
      const response = await cartApi.removeFromCart(isbn);
      const cartItems = transformCartItems(response.data.data.items || []);
      setItems(cartItems);

      toast({
        title: "Removed from Cart",
        description: "Item removed successfully",
      });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (isbn: string, quantity: number) => {
    try {
      if (quantity < 1) {
        await removeFromCart(isbn);
        return;
      }

      const response = await cartApi.updateQuantity(isbn, quantity);
      const cartItems = transformCartItems(response.data.data.items || []);
      setItems(cartItems);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
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
        loading,
        refreshCart,
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
