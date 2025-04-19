import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { initAuthStore } from "./modules/auth/auth-store";
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import AccountListPage from './pages/AccountListPage';
import AssetPage from './pages/AssetPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    initAuthStore();
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
        // Add more routes as needed
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;