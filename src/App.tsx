import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './users/ProfilePage';
import ProfileEditPage from './users/ProfileEditPage';
import ChangePasswordPage from './users/ChangePasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import AccountListPage from './accounts/AccountListPage';
import AssetPage from './assets/AssetPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import TransactionListPage from './transactions/TransactionListPage';

import { useEffect } from 'react';
import { useAuthStore } from './users/auth-store';

function App() {
  useEffect(() => {
    const set = useAuthStore.setState;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      set({ user, isAuthenticated: true, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
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
        { path: 'profile', element: <ProfilePage /> },
        { path: 'profile/edit', element: <ProfileEditPage /> },
        {
          path: 'profile/change-password',
          element: <ProtectedRoute><ChangePasswordPage /></ProtectedRoute>,
        },
        { path: 'accounts', element: <ProtectedRoute><AccountListPage /></ProtectedRoute> },
        { path: 'asset', element: <ProtectedRoute><AssetPage /></ProtectedRoute> },
        { path: 'transactions', element: <ProtectedRoute><TransactionListPage /></ProtectedRoute> },
        // Add more routes as needed
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;