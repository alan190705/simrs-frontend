import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { RequireAuth } from '@/modules/auth';
import { LoginPage } from '@/modules/auth';
import { DashboardPage } from '@/modules/dashboard';
import { UsersPage } from '@/modules/users';
import { NotFoundPage } from '@/shared/components';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      // Modul berikut tinggal ditambah di sini
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);