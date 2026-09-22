import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '@/app/navigation';
import { useAuth } from '@/modules/auth';
import { cn } from '@/lib/cn';

export function MainLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    if (!window.confirm('Yakin ingin keluar dari aplikasi?')) return;
    logout();
    navigate('/login', { replace: true });
  }

  // Ambil inisial dari nama user (maks 2 huruf)
  const initials = (user?.fullName ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="min-h-screen lg:pl-64">
      {open && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-brand-900 text-brand-50 transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <span className="text-lg font-semibold tracking-tight">SIMRS</span>
          <button
            className="rounded p-1 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav
          className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4"
          aria-label="Menu utama"
        >
          {NAV_ITEMS.map(({ path, label, icon: Icon, ready }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-brand-100',
                  isActive
                    ? 'bg-white/15 font-medium text-white'
                    : 'hover:bg-white/10',
                  !ready && !isActive && 'text-brand-100/70',
                )
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-8">
        <button
          className="rounded p-2 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
        >
          <Menu className="size-5" />
        </button>

        <p className="hidden text-sm text-slate-600 sm:block">
          Sistem Informasi Manajemen Rumah Sakit
        </p>

        {/* Spacer supaya konten kanan mepet ke kanan */}
        <div className="ml-auto flex items-center gap-3">
          {/* Info user */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight text-slate-900">
                  {user.fullName}
                </p>
                <p className="text-xs leading-tight text-slate-500">
                  {user.username}
                </p>
              </div>
              <div
                className="grid size-9 place-items-center rounded-full bg-brand-900 text-xs font-semibold text-brand-50"
                aria-hidden
              >
                {initials}
              </div>
            </div>
          )}

          {/* Tombol logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            aria-label="Keluar dari aplikasi"
          >
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <main className="p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}