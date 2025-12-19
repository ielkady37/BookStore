import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Minus, Plus, BookOpen, Calendar, Building2, Tag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { books } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { getCategoryIcon } from '@/data/mockData';

const BookDetails = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const book = books.find((b) => b.isbn === isbn);

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Book Not Found</h1>
        <p className="mt-2 text-muted-foreground">The book you're looking for doesn't exist.</p>
        <Link to="/books">
          <Button className="mt-6">Browse Books</Button>
        </Link>
      </div>
    );
  }

  const isInStock = book.quantity > 0;

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream-dark/50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-large">
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Category Badge */}
            <div className="absolute left-4 top-4 rounded-full bg-background/90 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <span className="mr-2">{getCategoryIcon(book.category)}</span>
              {book.category}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <p className="font-medium text-primary">{book.authors.join(', ')}</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-foreground lg:text-5xl">
              {book.title}
            </h1>

            {book.description && (
              <p className="mt-6 text-lg text-muted-foreground">{book.description}</p>
            )}

            {/* Meta Info */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">ISBN</p>
                  <p className="font-medium">{book.isbn}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Published</p>
                  <p className="font-medium">{book.publicationYear}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Publisher</p>
                  <p className="font-medium">{book.publisher.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium">{book.category}</p>
                </div>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="mt-8 flex-1" />
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-display text-4xl font-bold text-primary">
                    ${book.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className={`font-medium ${isInStock ? 'text-sage' : 'text-destructive'}`}>
                    {isInStock ? `${book.quantity} in stock` : 'Out of stock'}
                  </p>
                </div>
              </div>

              {isInStock && (
                <div className="mt-6 flex items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center rounded-lg border border-border">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(book.quantity, quantity + 1))}
                      disabled={quantity >= book.quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
