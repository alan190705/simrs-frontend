import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui';
import { cn } from '@/lib/cn';

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string) => void;
  isSubmitting: boolean;
  userName: string;
}

export function ResetPasswordModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  userName,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setPassword('');
      setConfirm('');
      setError('');
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi password tidak cocok');
      return;
    }
    onSubmit(password);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-slate-900">
          Reset Password
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Ubah password untuk <span className="font-medium text-slate-700">{userName}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Password Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              autoFocus
              className={inputClass(!!error)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password baru"
              autoComplete="new-password"
              className={inputClass(!!error)}
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
              Simpan Password
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