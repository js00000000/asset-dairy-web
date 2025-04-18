import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X, ShoppingBag, Store, Heart, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/auth-store';
import { useCartStore } from '../../store/cart-store';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, itemCount } = useCartStore();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const headerBackground = isScrolled
    ? 'bg-white shadow-sm'
    : 'bg-white/80 backdrop-blur-sm';

  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerBackground}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="Elite Marketplace">
            <ShoppingBag className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Elite</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Shop
            </Link>
            <Link to="/categories" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Categories
            </Link>
            {user?.role === 'seller' && (
              <Link to="/seller/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                Seller Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <Link to="/wishlist" className="p-2 text-gray-500 hover:text-primary-600 transition-colors" aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors" aria-label="Cart">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User size={20} />
                  <span>{user?.name?.split(' ')[0]}</span>
                </button>
                
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      {user?.role === 'seller' && (
                        <Link
                          to="/seller/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Seller Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-500" aria-label="Cart">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-gray-200 bg-white py-4"
          >
            <div className="container mx-auto px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-200"
          >
            <div className="space-y-1 px-4 py-5">
              <Link
                to="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Shop
              </Link>
              <Link
                to="/categories"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Categories
              </Link>
              <Link
                to="/wishlist"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                Wishlist
              </Link>
              {user?.role === 'seller' && (
                <Link
                  to="/seller/dashboard"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Seller Dashboard
                </Link>
              )}
              <div className="pt-4">
                <div className="border-t border-gray-200 pt-4">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="flex items-center px-3 py-2">
                        <User className="mr-2" size={20} />
                        <span className="text-base font-medium text-gray-900">{user?.name}</span>
                      </div>
                      <Link
                        to="/account"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                        onClick={closeMobileMenu}
                      >
                        Your Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                        onClick={closeMobileMenu}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                        className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                      >
                        <LogOut className="mr-2" size={18} />
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 px-3">
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block rounded-md bg-white px-3 py-2 text-center text-base font-medium text-primary-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="block rounded-md bg-primary-600 px-3 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-primary-700"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;