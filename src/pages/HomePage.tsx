import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Award, Truck } from 'lucide-react';
import { useProductStore } from '../store/product-store';
import ProductCard from '../components/ui/ProductCard';
import CategoryCard from '../components/ui/CategoryCard';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const { products, categories, featured } = useProductStore();
  
  // Get a subset of products for different sections
  const popularProducts = products.slice(0, 4);
  const newArrivals = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
  const displayCategories = categories.slice(0, 4);
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Discover Premium Products from Trusted Sellers</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Explore our curated collection of high-quality products from verified sellers around the world.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    rightIcon={<ChevronRight size={18} />}
                  >
                    Shop Now
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                    Become a Seller
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Elite Marketplace" 
                  className="rounded-lg shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-white text-black p-4 rounded-lg shadow-lg">
                  <p className="text-sm font-semibold">Trusted by</p>
                  <p className="text-2xl font-bold">5000+ Sellers</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              className="bg-white p-6 rounded-lg shadow-subtle"
            >
              <div className="h-12 w-12 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">All products go through strict quality checks before listing on our platform.</p>
            </motion.div>
            
            <motion.div 
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              className="bg-white p-6 rounded-lg shadow-subtle"
            >
              <div className="h-12 w-12 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick delivery options with real-time tracking for all your orders.</p>
            </motion.div>
            
            <motion.div 
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              className="bg-white p-6 rounded-lg shadow-subtle md:col-span-2 lg:col-span-1"
            >
              <div className="h-12 w-12 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Sellers</h3>
              <p className="text-gray-600">Shop with confidence from our network of trusted, verified merchants.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked products we think you'll love</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center text-primary-600 hover:text-primary-700">
              <span className="font-medium">View all products</span>
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, index) => (
              <motion.div
                key={product.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop">
              <Button variant="outline" rightIcon={<ChevronRight size={16} />}>
                View all products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-2">Shop by Category</h2>
            <p className="text-gray-600">Browse our wide range of product categories</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((category, index) => (
              <motion.div
                key={category.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/categories">
              <Button variant="outline" rightIcon={<ChevronRight size={16} />}>
                View all categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Popular Right Now</h2>
              <p className="text-gray-600">Top trending products this week</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center text-primary-600 hover:text-primary-700">
              <span className="font-medium">View all</span>
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product, index) => (
              <motion.div
                key={product.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Selling on Elite Marketplace</h2>
                <p className="text-gray-600 mb-6">
                  Join thousands of successful sellers on our platform. Reach millions of buyers and grow your business with our powerful selling tools.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mt-0.5">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium">Easy Setup</h3>
                      <p className="text-gray-600">Create your seller account in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mt-0.5">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium">Powerful Tools</h3>
                      <p className="text-gray-600">Manage inventory, orders, and analytics</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mt-0.5">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium">Secure Payments</h3>
                      <p className="text-gray-600">Fast payouts and secure transactions</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link to="/register">
                    <Button variant="primary" size="lg">
                      Start Selling
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 bg-primary-600">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.pexels.com/photos/3921852/pexels-photo-3921852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Seller dashboard"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">New Arrivals</h2>
              <p className="text-gray-600">The latest additions to our marketplace</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center text-primary-600 hover:text-primary-700">
              <span className="font-medium">View all</span>
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;