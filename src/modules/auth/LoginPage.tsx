import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

// Placeholder. Form login, token, dan RequireAuth dibuat di Tahap 2.
export function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <Card title="Masuk ke SIMRS" className="w-full max-w-sm">
        <p className="text-sm text-slate-600">Login belum aktif. Fitur ini dikerjakan pada Tahap 2 (Authentication).</p>
        <Link to="/dashboard" className="mt-4 inline-block text-sm font-medium text-brand-700 underline">Buka dashboard</Link>
      </Card>
    </div>
  );
}
