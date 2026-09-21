import { Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Memuat data…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 py-6 text-sm text-slate-600">
      <Loader2 className="size-4 animate-spin" aria-hidden /> {label}
    </div>
  );
}
