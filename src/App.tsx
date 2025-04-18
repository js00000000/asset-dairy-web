import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initAuthStore, useAuthStore } from './store/auth-store';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import SellerDashboardPage from './pages/SellerDashboardPage';


// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    initAuthStore();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="products/:productId" element={<ProductPage />} />
          <Route 
            path="checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="order-confirmation" 
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="seller/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboardPage />
              </ProtectedRoute>
            } 
          />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;