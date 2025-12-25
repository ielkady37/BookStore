import { Book } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();

  const getStockStatus = () => {
    if (book.stockQuantity === 0) {
      return { label: 'Out of Stock', variant: 'outOfStock' as const };
    }
    if (book.stockQuantity < book.threshold) {
      return { label: 'Low Stock', variant: 'lowStock' as const };
    }
    return { label: 'In Stock', variant: 'inStock' as const };
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="group overflow-hidden border-0 shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge
          variant={stockStatus.variant}
          className="absolute top-3 right-3"
        >
          {stockStatus.label}
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            variant="hero"
            size="sm"
            className="w-full"
            onClick={() => addToCart(book)}
            disabled={book.stockQuantity === 0}
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
            <p className="text-sm text-muted-foreground truncate">{book.author}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display font-bold text-lg text-primary">
              ${book.price.toFixed(2)}
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
