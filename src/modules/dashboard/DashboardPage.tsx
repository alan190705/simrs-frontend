import { Card } from '@/shared/components/ui';
import { EmptyState } from '@/shared/components/feedback';
import { StatGrid, SystemStatusCard } from './components';

export function DashboardPage() {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">{today}</p>
      </div>

      <StatGrid />
      <SystemStatusCard />

      <Card title="Modul yang akan datang">
        <EmptyState
          title="Belum ada data untuk ditampilkan"
          description="Jumlah pasien, kunjungan, dan bed akan muncul di sini setelah modul Pasien dan Pendaftaran selesai."
        />
      </Card>
    </div>
  );
}