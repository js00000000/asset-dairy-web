import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { formatCurrency, calculateDiscount } from '../../lib/utils';
import Button from './Button';
import { useCartStore } from '../../modules/cart/cart-store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.images[0],
      quantity: 1,
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-subtle hover:shadow-product transition-shadow duration-300"
    >
      <Link to={`/products/${product.id}`} className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          
          {product.discountedPrice && (
            <div className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {calculateDiscount(product.price, product.discountedPrice)}% OFF
            </div>
          )}
          
          <button
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 backdrop-blur-sm transition-colors hover:bg-primary-500 hover:text-white"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={16} />
          </button>
        </div>
        
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-1 text-xs text-gray-500">{product.category}</div>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
          
          <div className="mt-2 flex items-center">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? 'text-accent-500' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">({product.reviewCount})</span>
          </div>
          
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-end gap-1">
              {product.discountedPrice ? (
                <>
                  <span className="text-lg font-medium text-gray-900">
                    {formatCurrency(product.discountedPrice)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-medium text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="sm"
              className="p-2"
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;