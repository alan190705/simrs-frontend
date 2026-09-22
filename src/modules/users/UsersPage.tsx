import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/shared/components/ui';
import type { QueryUserParams, User } from './users.types';
import {
  useCreateUser,
  useDeleteUser,
  useChangeUserPassword,
  useUpdateUser,
  useUsers,
} from './users.hooks';
import {
  DeleteConfirmModal,
  Pagination,
  ResetPasswordModal,
  UserFormModal,
  UserTable,
} from './components';

const LIMIT = 10;

export function UsersPage() {
  // ---------- State UI ----------
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [resettingUser, setResettingUser] = useState<User | null>(null);

  // ---------- Query params ----------
  const queryParams: QueryUserParams = useMemo(() => {
    const params: QueryUserParams = { page, limit: LIMIT };
    if (search) params.search = search;
    if (filterActive === 'active') params.isActive = true;
    if (filterActive === 'inactive') params.isActive = false;
    return params;
  }, [page, search, filterActive]);

  // ---------- Data ----------
  const { data, isLoading, isError, error, refetch } = useUsers(queryParams);

  const users: User[] = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: LIMIT, total: 0 };

  // ---------- Mutations ----------
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser(editingUser?.id ?? '');
  const deleteMutation = useDeleteUser();
  const passwordMutation = useChangeUserPassword(resettingUser?.id ?? '');

  // ---------- Handlers ----------
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function handleOpenCreate() {
    setEditingUser(null);
    setFormOpen(true);
  }

  function handleOpenEdit(user: User) {
    setEditingUser(user);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditingUser(null);
  }

  function handleFormSubmit(input: any) {
    if (editingUser) {
      updateMutation.mutate(input, {
        onSuccess: () => handleCloseForm(),
      });
    } else {
      createMutation.mutate(input, {
        onSuccess: () => handleCloseForm(),
      });
    }
  }

  function handleConfirmDelete() {
    if (!deletingUser) return;
    deleteMutation.mutate(deletingUser.id, {
      onSuccess: () => setDeletingUser(null),
    });
  }

  function handleConfirmResetPassword(newPassword: string) {
    if (!resettingUser) return;
    passwordMutation.mutate(
      { newPassword },
      { onSuccess: () => setResettingUser(null) },
    );
  }

  // ---------- Render ----------
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Manajemen User
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola akun pengguna aplikasi.
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      {/* Filter bar */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari username, email, atau nama…"
              className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </form>

          <select
            value={filterActive}
            onChange={(e) => {
              setFilterActive(e.target.value as any);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="all">Semua status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Konten utama */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="p-4">
          {isLoading && (
            <div className="py-12 text-center text-sm text-slate-500">
              Memuat data user…
            </div>
          )}

          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {error instanceof Error ? error.message : 'Gagal memuat data user.'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800"
              >
                Coba lagi
              </button>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <UserTable
                users={users}
                onEdit={handleOpenEdit}
                onDelete={setDeletingUser}
                onResetPassword={setResettingUser}
                isDeleting={deleteMutation.isPending}
              />

              {users.length > 0 && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <Pagination
                    page={meta.page}
                    limit={meta.limit}
                    total={meta.total}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <UserFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        user={editingUser}
      />

      <DeleteConfirmModal
        open={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus user?"
        description={`User "${deletingUser?.fullName}" akan dinonaktifkan dan tidak bisa login lagi.`}
        isLoading={deleteMutation.isPending}
      />

      <ResetPasswordModal
        open={!!resettingUser}
        onClose={() => setResettingUser(null)}
        onSubmit={handleConfirmResetPassword}
        isSubmitting={passwordMutation.isPending}
        userName={resettingUser?.fullName ?? ''}
      />
    </div>
  );
}