import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui';
import { cn } from '@/lib/cn';
import { useBranches, useRoles } from '../users.hooks';
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserRoleInput,
} from '../users.types';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  isSubmitting: boolean;
  user?: User | null;
}

interface FormState {
  username: string;
  email: string;
  fullName: string;
  password: string;
  isActive: boolean;
  roleIds: string[];      // multi-role
  branchId: string;       // single branch
}

const INITIAL: FormState = {
  username: '',
  email: '',
  fullName: '',
  password: '',
  isActive: true,
  roleIds: [],
  branchId: '',
};

export function UserFormModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  user,
}: UserFormModalProps) {
  const isEdit = !!user;
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch master data
  const rolesQuery = useRoles();
  const branchesQuery = useBranches();
  const roles = rolesQuery.data?.data ?? [];
  const branches = branchesQuery.data?.data ?? [];

  useEffect(() => {
    if (!open) return;
    if (user) {
      setForm({
        username: user.username,
        email: user.email ?? '',
        fullName: user.fullName,
        password: '',
        isActive: user.isActive,
        roleIds: user.roles.map((r) => r.roleId),
        branchId: user.branches.find((b) => b.isDefault)?.branchId
          ?? user.branches[0]?.branchId
          ?? '',
      });
    } else {
      setForm(INITIAL);
    }
    setErrors({});
  }, [open, user]);

  if (!open) return null;

  function toggleRole(roleId: string) {
    setForm((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (form.username.trim().length < 3) {
      errs.username = 'Username minimal 3 karakter';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(form.username)) {
      errs.username = 'Username hanya boleh huruf, angka, titik, underscore, strip';
    }
    if (form.fullName.trim().length < 2) {
      errs.fullName = 'Nama lengkap minimal 2 karakter';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Format email tidak valid';
    }
    if (!isEdit && form.password.length < 8) {
      errs.password = 'Password minimal 8 karakter';
    }
    if (isEdit && form.password && form.password.length < 8) {
      errs.password = 'Password minimal 8 karakter';
    }
    if (form.roleIds.length === 0) {
      errs.roleIds = 'Pilih minimal 1 role';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const roles: UserRoleInput[] = form.roleIds.map((roleId) => ({
      roleId,
      branchId: null, // global dulu
    }));

    const branches = form.branchId
      ? [{ branchId: form.branchId, isDefault: true }]
      : [];

    if (isEdit) {
      const payload: UpdateUserInput = {
        username: form.username.trim(),
        fullName: form.fullName.trim(),
        isActive: form.isActive,
        roles,
        branches,
      };
      if (form.email.trim()) payload.email = form.email.trim();
      onSubmit(payload);
    } else {
      const payload: CreateUserInput = {
        username: form.username.trim(),
        fullName: form.fullName.trim(),
        password: form.password,
        isActive: form.isActive,
        roles,
        branches,
      };
      if (form.email.trim()) payload.email = form.email.trim();
      onSubmit(payload);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit User' : 'Tambah User'}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {isEdit
              ? 'Ubah data user. Kosongkan password kalau tidak ingin diubah.'
              : 'Isi data user baru.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="space-y-4">
            <Field label="Username" required error={errors.username} hint={!errors.username ? 'Huruf, angka, titik, underscore, strip' : undefined}>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="mis. budi.santoso"
                autoComplete="off"
                className={inputClass(!!errors.username)}
              />
            </Field>

            <Field label="Nama Lengkap" required error={errors.fullName}>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="mis. Budi Santoso"
                autoComplete="off"
                className={inputClass(!!errors.fullName)}
              />
            </Field>

            <Field label="Email" error={errors.email} hint={!errors.email ? 'Opsional' : undefined}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="mis. budi@simrs.local"
                autoComplete="off"
                className={inputClass(!!errors.email)}
              />
            </Field>

            {/* ===== ROLE (multi-checkbox) ===== */}
            <Field label="Role" required error={errors.roleIds} hint={!errors.roleIds ? 'Bisa pilih lebih dari satu' : undefined}>
              {rolesQuery.isLoading ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                  Memuat role…
                </div>
              ) : roles.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                  Belum ada role di sistem.
                </div>
              ) : (
                <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                  {roles.map((role) => (
                    <label
                      key={role.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.roleIds.includes(role.id)}
                        onChange={() => toggleRole(role.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="font-medium">{role.name}</span>
                      <span className="text-xs text-slate-400">({role.code})</span>
                    </label>
                  ))}
                </div>
              )}
            </Field>

            {/* ===== BRANCH (single select) ===== */}
            <Field label="Cabang" error={errors.branchId} hint={!errors.branchId ? 'Opsional' : undefined}>
              {branchesQuery.isLoading ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                  Memuat cabang…
                </div>
              ) : (
                <select
                  value={form.branchId}
                  onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                  className={inputClass(!!errors.branchId)}
                >
                  <option value="">— Pilih cabang —</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field
              label="Password"
              required={!isEdit}
              error={errors.password}
              hint={isEdit ? 'Kosongkan kalau tidak ingin mengubah password' : 'Minimal 8 karakter'}
            >
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={isEdit ? '••••••••' : 'Masukkan password'}
                autoComplete="new-password"
                className={inputClass(!!errors.password)}
              />
            </Field>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              User aktif (bisa login)
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
              {isEdit ? 'Simpan Perubahan' : 'Buat User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- helpers ----------

function inputClass(hasError: boolean) {
  return cn(
    'block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition',
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20',
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}