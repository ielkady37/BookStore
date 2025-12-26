import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Book } from "@/types"; // Fixed: Import from types, not mockData

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/auth"); // Redirect if not logged in
      return;
    }
    addToCart(book);
  };

  const getStockStatus = () => {
    // Fixed: Use 'stock_quantity' (snake_case)
    if (book.stock_quantity === 0) {
      return { label: "Out of Stock", variant: "destructive" as const };
    }
    if (book.stock_quantity < book.threshold) {
      return { label: "Low Stock", variant: "secondary" as const };
    }
    return { label: "In Stock", variant: "default" as const };
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="group overflow-hidden border-0 shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          // Fallback if no image in DB
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-muted-foreground/20">
            <span className="text-4xl font-display font-bold">
              {book.title.charAt(0)}
            </span>
          </div>
        )}

        <Badge variant={stockStatus.variant} className="absolute top-3 right-3">
          {stockStatus.label}
        </Badge>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            variant="hero"
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
            disabled={book.stock_quantity === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground leading-tight line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {book.authors}
            </p>
          </div>
          <div className="text-right shrink-0">
            {/* Fixed: Use selling_price */}
            <p className="font-display font-bold text-lg text-primary">
              ${book.selling_price.toFixed(2)}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {book.category}
        </Badge>
      </CardContent>
    </Card>
  );
}
