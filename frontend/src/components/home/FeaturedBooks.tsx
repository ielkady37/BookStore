import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookCard from '@/components/books/BookCard';
import { books } from '@/data/mockData';

const FeaturedBooks = () => {
  const featuredBooks = books.slice(0, 4);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Featured Books
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked selections from our collection
            </p>
          </div>
          <Link to="/books">
            <Button variant="ghost" className="gap-2">
              View All Books
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBooks.map((book, index) => (
            <BookCard key={book.isbn} book={book} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
