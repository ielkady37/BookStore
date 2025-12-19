import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookCategory } from '@/types';
import { getCategoryIcon } from '@/data/mockData';

interface CategoryCardProps {
  category: BookCategory;
  bookCount: number;
  index?: number;
}

const categoryColors: Record<BookCategory, string> = {
  Science: 'from-blue-500/20 to-cyan-500/20',
  Art: 'from-pink-500/20 to-rose-500/20',
  Religion: 'from-purple-500/20 to-violet-500/20',
  History: 'from-amber-500/20 to-orange-500/20',
  Geography: 'from-emerald-500/20 to-green-500/20',
};

const CategoryCard = ({ category, bookCount, index = 0 }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/books?category=${category}`}
        className="group block"
      >
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${categoryColors[category]} p-6 transition-all duration-300 hover:shadow-large`}>
          <div className="relative z-10">
            <span className="text-4xl">{getCategoryIcon(category)}</span>
            <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
              {category}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {bookCount} {bookCount === 1 ? 'book' : 'books'}
            </p>
          </div>
          
          {/* Decorative Circle */}
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/10 transition-transform duration-500 group-hover:scale-150" />
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
