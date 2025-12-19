import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BookCard from '@/components/books/BookCard';
import SearchFilters from '@/components/books/SearchFilters';
import { books, publishers } from '@/data/mockData';

const Books = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPublisher, setSelectedPublisher] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.authors.some((a) => a.toLowerCase().includes(query)) ||
          book.isbn.includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((book) => book.category === selectedCategory);
    }

    // Publisher filter
    if (selectedPublisher !== 'all') {
      const publisher = publishers.find((p) => p.id === selectedPublisher);
      if (publisher) {
        result = result.filter((book) => book.publisher.id === selectedPublisher);
      }
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'year-desc':
          return b.publicationYear - a.publicationYear;
        case 'year-asc':
          return a.publicationYear - b.publicationYear;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedCategory, selectedPublisher, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream-dark/50">
      {/* Header */}
      <div className="bg-cream-dark py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-4xl font-bold text-foreground">
              Browse Books
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explore our collection of {books.length} books
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPublisher={selectedPublisher}
          onPublisherChange={setSelectedPublisher}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Results */}
        <div className="mt-8">
          {filteredBooks.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredBooks.map((book, index) => (
                  <BookCard key={book.isbn} book={book} index={index} />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <p className="text-xl font-medium text-muted-foreground">
                No books found matching your criteria
              </p>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
