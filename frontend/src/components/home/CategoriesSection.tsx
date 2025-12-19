import { motion } from 'framer-motion';
import CategoryCard from '@/components/books/CategoryCard';
import { books, categories } from '@/data/mockData';
import { BookCategory } from '@/types';

const CategoriesSection = () => {
  const getCategoryCount = (category: BookCategory) =>
    books.filter((book) => book.category === category).length;

  return (
    <section className="bg-cream-dark py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find books that match your interests
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, index) => (
            <CategoryCard
              key={category}
              category={category}
              bookCount={getCategoryCount(category)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
