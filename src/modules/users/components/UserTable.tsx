import { Pencil, KeyRound, Trash2 } from 'lucide-react';
import type { User } from '../users.types';
import { UserStatusBadge } from './UserStatusBadge';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  isDeleting?: boolean;
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onResetPassword,
  isDeleting = false,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-sm text-slate-500">Belum ada user.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Username</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Login Terakhir</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{user.fullName}</p>
                {user.roles.length > 0 && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {user.roles.map((r) => r.role.name).join(', ')}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 text-slate-700">{user.username}</td>
              <td className="px-4 py-3 text-slate-700">{user.email ?? '—'}</td>
              <td className="px-4 py-3">
                <UserStatusBadge isActive={user.isActive} />
              </td>
              <td className="px-4 py-3 text-slate-500">
                {formatDate(user.lastLoginAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    title="Edit"
                    className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onResetPassword(user)}
                    title="Reset password"
                    className="rounded-md p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
                  >
                    <KeyRound className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    disabled={isDeleting}
                    title="Hapus"
                    className="rounded-md p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}