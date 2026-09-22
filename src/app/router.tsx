import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { RequireAuth, RequireModule } from '@/modules/auth';
import { LoginPage } from '@/modules/auth';
import { DashboardPage } from '@/modules/dashboard';
import { UsersPage } from '@/modules/users';
import { NotFoundPage } from '@/shared/components';

// ============================================================
// HALAMAN PLACEHOLDER UNTUK MODUL BELUM TERSEDIA
// ============================================================

function ComingSoonPage() {
  const { code } = useParams<{ code: string }>();

  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">
        Modul belum tersedia
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Modul{' '}
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">
          {code}
        </span>{' '}
        sedang dalam tahap pengembangan.
      </p>
      <p className="mt-6 text-xs text-slate-400">
        Hubungi administrator jika Anda membutuhkan modul ini segera.
      </p>
    </div>
  );
}

// ============================================================
// ROUTER
// ============================================================

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

      // Dashboard — semua user yang login boleh akses
      {
        path: 'dashboard',
        element: (
          <RequireModule module="dashboard">
            <DashboardPage />
          </RequireModule>
        ),
      },

      // Manajemen User — butuh module 'user-management'
      {
        path: 'users',
        element: (
          <RequireModule module="user-management">
            <UsersPage />
          </RequireModule>
        ),
      },

      // Placeholder untuk modul yang belum diimplementasi
      { path: 'coming-soon/:code', element: <ComingSoonPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);