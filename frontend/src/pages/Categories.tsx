import { motion } from 'framer-motion';
import CategoryCard from '@/components/books/CategoryCard';
import { books, categories } from '@/data/mockData';
import { BookCategory } from '@/types';

const Categories = () => {
  const getCategoryCount = (category: BookCategory) =>
    books.filter((book) => book.category === category).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream-dark/50">
      {/* Header */}
      <div className="bg-cream-dark py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl font-bold text-foreground">
              Book Categories
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explore our curated collection across five domains of knowledge
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category}
              category={category}
              bookCount={getCategoryCount(category)}
              index={index}
            />
          ))}
        </div>

        {/* Category Descriptions */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              category: 'Science',
              icon: '🔬',
              description: 'Explore the mysteries of the universe, from quantum physics to the origins of life.',
            },
            {
              category: 'Art',
              icon: '🎨',
              description: 'Discover the beauty of human expression through paintings, sculpture, and design.',
            },
            {
              category: 'Religion',
              icon: '📿',
              description: 'Journey through spiritual traditions and philosophical wisdom from around the world.',
            },
            {
              category: 'History',
              icon: '📜',
              description: 'Travel through time and learn from the triumphs and tribulations of human civilization.',
            },
            {
              category: 'Geography',
              icon: '🌍',
              description: "Understand our world's landscapes, cultures, and the forces that shape nations.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl bg-card p-6 shadow-soft"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-3 font-display text-xl font-bold">{item.category}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
