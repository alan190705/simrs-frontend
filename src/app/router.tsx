import { Navigate, createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '@/modules/auth/LoginPage';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { ModulePlaceholder } from '@/modules/shared/ModulePlaceholder';
import { NotFoundPage } from '@/modules/shared/NotFoundPage';
import { NAV_ITEMS } from './navigation';

// Tahap 2: bungkus route MainLayout dengan <RequireAuth> (redirect ke /login jika belum login).
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      ...NAV_ITEMS.filter((i) => !i.ready).map((i) => ({ path: i.path, element: <ModulePlaceholder item={i} /> })),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
