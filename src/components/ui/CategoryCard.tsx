import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-lg"
    >
      <Link to={`/category/${category.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={category.image || 'https://images.pexels.com/photos/3965548/pexels-photo-3965548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
            alt={category.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute inset-0 flex items-end p-4">
            <div className="w-full">
              <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              <div className="mt-2 h-8">
                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm group-hover:bg-primary-600/80 transition-colors">
                  Explore
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;