import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { initAuthStore, useAuthStore } from "./modules/auth/auth-store";
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

function App() {
  useEffect(() => {
    initAuthStore();
  }, []);

  // ProtectedRoute wrapper for data router
  const protectedElement = (element: React.ReactNode, allowedRoles?: string[]) => {
    const { user, isAuthenticated } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    return <>{element}</>;
  };

  // Routes config for createBrowserRouter
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'cart', element: <CartPage /> },
        { path: 'products/:productId', element: <ProductPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'profile/edit', element: <ProfileEditPage /> },
        {
          path: 'profile/change-password',
          element: protectedElement(<ChangePasswordPage />),
        },
        {
          path: 'checkout',
          element: protectedElement(<CheckoutPage />),
        },
        {
          path: 'order-confirmation',
          element: protectedElement(<OrderConfirmationPage />),
        },
        {
          path: 'seller/dashboard',
          element: protectedElement(<SellerDashboardPage />, ['seller']),
        },
        // Add more routes as needed
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;