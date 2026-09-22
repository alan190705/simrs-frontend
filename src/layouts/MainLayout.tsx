import { LogOut, Menu, X, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { buildNavGroups } from '@/app/navigation';
import { useAuth } from '@/modules/auth';
import { cn } from '@/lib/cn';

export function MainLayout() {
  const [open, setOpen] = useState(false);
  const { user, access, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    if (!window.confirm('Yakin ingin keluar dari aplikasi?')) return;
    logout();
    navigate('/login', { replace: true });
  }

  // Build nav groups dari access
  const navGroups = useMemo(() => {
    if (!access?.modules) return [];
    return buildNavGroups(access.modules);
  }, [access]);

  const initials = (user?.fullName ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-brand-900 text-slate-300 transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-5">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight text-white">
              SIMRS
            </span>
          </div>
          <button
            className="rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 space-y-6 overflow-y-auto px-3 py-4"
          aria-label="Menu utama"
        >
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          {!isLoading && navGroups.length === 0 && (
            <div className="px-3 py-8 text-center text-xs text-slate-500">
              Tidak ada modul yang bisa diakses.
            </div>
          )}

          {!isLoading &&
            navGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map(({ path, label, icon: Icon }) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-primary-500/15 font-medium text-primary-400'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={cn(
                              'size-4 shrink-0',
                              isActive
                                ? 'text-primary-400'
                                : 'text-slate-500 group-hover:text-slate-300',
                            )}
                            aria-hidden
                          />
                          <span className="flex-1 truncate">{label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
        </nav>

        {/* Footer sidebar */}
        <div className="border-t border-white/5 px-5 py-3">
          <p className="text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} SIMRS
          </p>
        </div>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:px-8">
        <button
          className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
        >
          <Menu className="size-5" />
        </button>

        <p className="hidden text-sm font-medium text-slate-700 sm:block">
          Sistem Informasi Manajemen Rumah Sakit
        </p>

        <div className="ml-auto flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight text-slate-900">
                  {user.fullName}
                </p>
                <p className="text-xs leading-tight text-slate-500">
                  {user.username}
                </p>
              </div>
              <div
                className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-semibold text-white shadow-sm"
                aria-hidden
              >
                {initials}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
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