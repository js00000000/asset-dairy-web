import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/profile/ProfilePage';
import ProfileEditPage from '@/profile/ProfileEditPage';
import ChangePasswordPage from '@/profile/ChangePasswordPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PortfolioPage from '@/portfolio/PortfolioPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import TradeListPage from '@/trades/TradeListPage';
import { useEffect } from 'react';
import { useAuthStore } from '@/auth/auth-store';
import { Toaster } from 'react-hot-toast';

function App() {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  // Routes config for createBrowserRouter
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
        { path: 'profile/edit', element: <ProtectedRoute><ProfileEditPage /></ProtectedRoute> },
        {
          path: 'profile/change-password',
          element: <ProtectedRoute><ChangePasswordPage /></ProtectedRoute>,
        },
        { path: 'portfolio', element: <ProtectedRoute><PortfolioPage /></ProtectedRoute> },
        { path: 'trades', element: <ProtectedRoute><TradeListPage /></ProtectedRoute> },
        // Add more routes as needed
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
        }}
      />
    </>
  );
}

export default App;