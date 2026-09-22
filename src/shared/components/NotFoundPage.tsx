import { Link } from 'react-router-dom';
import { EmptyState } from '@/shared/components/feedback';

export function NotFoundPage() {
  return (
    <EmptyState
      title="Halaman tidak ditemukan"
      description="Alamat yang Anda buka tidak ada."
      action={<Link to="/dashboard" className="text-sm font-medium text-brand-700 underline">Kembali ke dashboard</Link>}
    />
  );
}
