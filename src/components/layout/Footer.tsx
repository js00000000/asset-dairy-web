import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, ShoppingBag } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-7 w-7 text-primary-500" />
              <span className="text-xl font-bold">Elite Marketplace</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Discover a premium shopping experience with carefully curated products from trusted sellers around the world.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-sm text-gray-400 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Special Deals
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Account</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Help</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Elite Marketplace. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;