import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Book } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { getCategoryIcon } from '@/data/mockData';

interface BookCardProps {
  book: Book;
  index?: number;
}

const BookCard = ({ book, index = 0 }: BookCardProps) => {
  const { addToCart } = useCart();
  const isInStock = book.quantity > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-card shadow-soft transition-all duration-300 hover:shadow-large"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <span className="mr-1">{getCategoryIcon(book.category)}</span>
          {book.category}
        </div>

        {/* Stock Badge */}
        {!isInStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-lg bg-destructive px-4 py-2 font-bold text-destructive-foreground">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/20 group-hover:opacity-100">
          <Link to={`/books/${book.isbn}`}>
            <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-medium">
              <Eye className="h-5 w-5" />
            </Button>
          </Link>
          {isInStock && (
            <Button
              variant="hero"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                addToCart(book);
              }}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-medium text-muted-foreground">
          {book.authors.join(', ')}
        </p>
        <Link to={`/books/${book.isbn}`}>
          <h3 className="mt-1 line-clamp-2 font-display text-lg font-semibold transition-colors hover:text-primary">
            {book.title}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${book.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            {isInStock ? `${book.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
