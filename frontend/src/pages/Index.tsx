/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { BookCard } from "@/components/BookCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { Book } from "@/types";

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBooks = async (filters: any = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/books", { params: filters });
      setBooks(res.data.data.books);
    } catch (error) {
      console.error("Failed to load books", error);
      toast({
        title: "Error",
        description: "Failed to load books from the library.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFilterChange = (newFilters: any) => {
    const cleanFilters = { ...newFilters };
    if (cleanFilters.category === "all") delete cleanFilters.category;

    fetchBooks(cleanFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              A World of Knowledge
              <span className="block text-primary">At Your Fingertips</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Explore our curated collection of books spanning Science, Art,
              History, and more. Find the perfect book to expand your horizons.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Books Section */}
      <main className="container py-8 md:py-12">
        {/* Pass the handler to SearchFilters */}
        <SearchFilters onFilterChange={handleFilterChange} />

        {/* Results Count */}
        <div className="flex items-center justify-between my-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {books.length}
            </span>{" "}
            books
          </p>
        </div>

        {/* Book Grid */}
        {loading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-[400px] bg-muted/20 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : books.length > 0 ? (
          // Real Data
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <div
                key={book.isbn} // Use ISBN from SQL
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">
              No books found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to discover more books.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold">Bibliomania</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
