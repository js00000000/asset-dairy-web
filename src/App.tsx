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
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import AccountListPage from './pages/AccountListPage';

function App() {
  useEffect(() => {
    initAuthStore();
  }, []);

  // ProtectedRoute wrapper for data router
  const protectedElement = (element: React.ReactNode) => {
    const { isAuthenticated } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" />;
    
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
        { path: 'profile', element: <ProfilePage /> },
        { path: 'profile/edit', element: <ProfileEditPage /> },
        {
          path: 'profile/change-password',
          element: protectedElement(<ChangePasswordPage />),
        },
        { path: 'accounts', element: protectedElement(<AccountListPage />) },
        // Add more routes as needed
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;