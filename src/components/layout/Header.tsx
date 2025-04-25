import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, PiggyBank, LogOut } from 'lucide-react';
import siteConfig from '../../config/site.config';
import { useAuthStore } from '../../auth/auth-store';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white shadow-sm`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo or Menu Bar (mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
          {/* Logo (desktop) */}
          <Link to="/" className="hidden md:flex items-center space-x-2" aria-label={siteConfig.name}>
            {siteConfig.logoUrl ? (
              <img src={siteConfig.logoUrl} alt={siteConfig.name} className="h-8 w-8 object-contain" />
            ) : (
              <PiggyBank className="h-8 w-8 text-primary-600" />
            )}
            <span className="text-xl font-bold text-gray-900">{siteConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} to={item.href} className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          {/* Profile icon always on right (mobile & desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors focus:outline-none" aria-label="Profile">
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/', { replace: true })
                  }}
                  className="ml-2 p-2 rounded-lg bg-red-600 text-white shadow hover:bg-red-700 transition flex items-center justify-center"
                  aria-label="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold shadow hover:bg-primary-700 transition">Sign In</button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 text-sm font-semibold shadow hover:bg-gray-300 transition">Sign Up</button>
                </Link>
              </>
            )}
          </div>

          {/* Profile icon on right (mobile) */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="p-2 text-gray-700 hover:text-primary-600 focus:outline-none" aria-label="Profile">
                  <User size={24} />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/', { replace: true });
                  }}
                  className="p-2 rounded-lg bg-red-600 text-white shadow hover:bg-red-700 transition flex items-center justify-center"
                  aria-label="Sign Out"
                >
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold shadow hover:bg-primary-700 transition">Sign In</button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 text-sm font-semibold shadow hover:bg-gray-300 transition">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu drawer (slide from left, half screen) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={closeMobileMenu}
              aria-label="Close menu overlay"
            />
            {/* Drawer */}
            <motion.nav
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed top-0 left-0 h-full w-1/2 max-w-xs z-50 bg-white shadow-xl flex flex-col`}
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <span className="font-bold text-lg text-primary-700">{siteConfig.name}</span>
                <button onClick={closeMobileMenu} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 flex flex-col justify-start px-4 py-6 space-y-4">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors rounded px-2 py-2"
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.nav>
          </>
        )}
      </AnimatePresence>


    </header>
  );
};

export default Header;