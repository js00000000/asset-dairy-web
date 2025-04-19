import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Star, Shield, TruckIcon, ChevronDown, MessageCircle, Plus, Minus } from 'lucide-react';
import { useProductStore } from '../modules/product/product-store';
import { useCartStore } from '../modules/cart/cart-store';
import { formatCurrency, formatDate, calculateDiscount, generateStarRating } from '../lib/utils';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import { mockReviews } from '../data/mock-data';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { getProductById, getProductsByCategory } = useProductStore();
  const { addItem } = useCartStore();
  
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');
  
  if (!productId) {
    return <div>Product not found</div>;
  }
  
  const product = getProductById(productId);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }
  
  const relatedProducts = getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4);
  const reviews = mockReviews.filter(review => review.productId === product.id);
  
  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.images[0],
      quantity,
    });
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  const stars = generateStarRating(product.rating);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <nav className="mb-8">
        <Link to="/shop" className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600">
          <ChevronLeft size={16} className="mr-1" />
          Back to shop
        </Link>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        {/* Product Images */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2"
        >
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            {product.discountedPrice && (
              <div className="absolute top-4 left-4 bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded">
                {calculateDiscount(product.price, product.discountedPrice)}% OFF
              </div>
            )}
            
            {product.images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
                  onClick={prevImage}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
                  onClick={nextImage}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-primary-500' : 'border-transparent'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.title} - image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-1/2"
        >
          <div className="text-sm text-gray-500 mb-2">
            {product.category}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {stars.map((type, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    type === 'full' ? 'text-accent-500 fill-accent-500' :
                    type === 'half' ? 'text-accent-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm text-gray-600">Sold by <a href="#" className="text-primary-600 hover:underline">{product.seller.name}</a></span>
          </div>
          
          <div className="mb-6 flex items-end">
            {product.discountedPrice ? (
              <>
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.discountedPrice)}
                </span>
                <span className="ml-2 text-lg text-gray-500 line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="ml-2 text-sm font-medium text-accent-600">
                  {calculateDiscount(product.price, product.discountedPrice)}% off
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Shield className="h-5 w-5 text-success-600 mr-2" />
              <span>Quality Guarantee</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <TruckIcon className="h-5 w-5 text-success-600 mr-2" />
              <span>Free shipping on orders over $50</span>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                className="h-10 w-10 rounded-l-md border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-600"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="h-10 w-16 border-t border-b border-gray-300 text-center text-gray-900"
              />
              <button
                className="h-10 w-10 rounded-r-md border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-600"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Plus size={16} />
              </button>
              <span className="ml-3 text-sm text-gray-500">
                {product.stock} available
              </span>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-8">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<ShoppingCart size={18} />}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-14 flex-shrink-0"
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-md">
              <button
                className="w-full flex justify-between items-center p-4 focus:outline-none"
                onClick={() => toggleSection('description')}
                aria-expanded={expandedSection === 'description'}
              >
                <span className="font-medium">Description</span>
                <ChevronDown
                  className={`transition-transform ${
                    expandedSection === 'description' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === 'description' && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-md">
              <button
                className="w-full flex justify-between items-center p-4 focus:outline-none"
                onClick={() => toggleSection('shipping')}
                aria-expanded={expandedSection === 'shipping'}
              >
                <span className="font-medium">Shipping & Returns</span>
                <ChevronDown
                  className={`transition-transform ${
                    expandedSection === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === 'shipping' && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Shipping</h4>
                  <p className="text-gray-600 mb-4">
                    Free standard shipping on orders over $50. Expedited and international shipping options available at checkout.
                  </p>
                  <h4 className="font-medium mb-2">Returns</h4>
                  <p className="text-gray-600">
                    We accept returns within 30 days of delivery. Items must be unused and in original packaging.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center">
                <div className="flex">
                  {stars.map((type, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        type === 'full' ? 'text-accent-500 fill-accent-500' :
                        type === 'half' ? 'text-accent-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-900 font-medium">{product.rating} out of 5</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{product.reviewCount} global ratings</p>
            </div>
            
            <Button
              variant="outline"
              rightIcon={<MessageCircle size={16} />}
            >
              Write a Review
            </Button>
          </div>
          
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={review.userAvatar}
                        alt={review.userName}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">{review.userName}</h4>
                        <span className="mx-2 text-gray-500">•</span>
                        <time className="text-sm text-gray-500">{formatDate(review.createdAt)}</time>
                      </div>
                      <div className="flex items-center mt-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-accent-500 fill-accent-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;