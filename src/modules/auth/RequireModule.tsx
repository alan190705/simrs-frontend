import { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from './AuthContext';
import { LoadingState } from '@/shared/components/feedback';

interface RequireModuleProps {
  module: string;
  permission?: string;
  children: ReactNode;
}

/**
 * Wrapper untuk route protection.
 *
 * Contoh:
 *   <RequireModule module="user-management">
 *     <UsersPage />
 *   </RequireModule>
 *
 * Kalau user tidak punya akses → tampil halaman 403 Forbidden.
 */
export function RequireModule({ module, permission, children }: RequireModuleProps) {
  const { access, isLoading, hasModule, hasPermission } = useAuth();

  // Kalau masih loading access, tampilkan loading
  if (isLoading || !access) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <LoadingState label="Memeriksa akses…" />
      </div>
    );
  }

  const allowed = permission
    ? hasPermission(module, permission)
    : hasModule(module);

  if (!allowed) {
    return <ForbiddenPage module={module} permission={permission} />;
  }

  return <>{children}</>;
}

// ============================================================
// HALAMAN 403 FORBIDDEN
// ============================================================

function ForbiddenPage({
  module,
  permission,
}: {
  module: string;
  permission?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-500">
        <ShieldAlert className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Akses Ditolak
      </h1>

      <p className="mt-3 text-sm text-slate-500">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>

      <div className="mt-6 inline-block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-600">Modul:</span>
          <span className="rounded bg-white px-2 py-0.5 font-mono text-slate-700">
            {module}
          </span>
        </div>
        {permission && (
          <div className="mt-2 flex items-center gap-2">
            <span className="font-medium text-slate-600">Permission:</span>
            <span className="rounded bg-white px-2 py-0.5 font-mono text-slate-700">
              {permission}
            </span>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Hubungi administrator jika Anda merasa ini sebuah kesalahan.
      </p>
    </div>
  );
}