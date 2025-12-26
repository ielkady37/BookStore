import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { CheckoutModal } from "./CheckoutModal";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    total,
    clearCart,
  } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false);
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg bg-background border-l border-border">
          <SheetHeader className="space-y-1">
            <SheetTitle className="font-display text-2xl flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              Your Cart
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                Your cart is empty
              </h3>
              <p className="text-muted-foreground mb-4">
                Discover our collection and add some books to your cart.
              </p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <div
                      key={item.book.isbn} // Fixed: Use ISBN
                      className="flex gap-4 p-4 bg-muted/50 rounded-lg animate-fade-in"
                    >
                      <div className="w-16 h-24 bg-background rounded-md shadow-sm flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                        {item.book.coverImage ? (
                          <img
                            src={item.book.coverImage}
                            alt={item.book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          item.book.title.substring(0, 2)
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-semibold text-sm leading-tight line-clamp-2">
                          {item.book.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.book.authors}
                        </p>
                        {/* Fixed: Use selling_price */}
                        <p className="text-sm font-semibold text-primary mt-2">
                          ${Number(item.book.selling_price).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center border border-border rounded-md bg-background">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.book.isbn,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.book.isbn,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.book.isbn)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          $
                          {(Number(item.book.selling_price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-display text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={handleCheckoutComplete}
        total={total}
      />
    </>
  );
}
