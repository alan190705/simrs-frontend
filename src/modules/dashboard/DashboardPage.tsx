import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { get, getErrorMessage } from '@/lib/api';

interface Readiness { status: string; database: string; uptime: number; timestamp: string }

export function DashboardPage() {
  // Alur yang diuji: React → REST API → NestJS → Prisma → PostgreSQL.
  const health = useQuery({ queryKey: ['health', 'ready'], queryFn: () => get<Readiness>('/health/ready'), refetchInterval: 30_000 });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <Card
        title="Koneksi ke server"
        description="Memeriksa API dan database PostgreSQL."
        action={<Button variant="secondary" size="sm" loading={health.isFetching} onClick={() => health.refetch()}>Periksa ulang</Button>}
      >
        {health.isLoading && <LoadingState label="Memeriksa koneksi…" />}
        {health.isError && <ErrorState message={getErrorMessage(health.error)} onRetry={() => health.refetch()} />}
        {health.data && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge tone="success">API aktif</Badge>
            <Badge tone={health.data.data.database === 'up' ? 'success' : 'danger'}>
              Database {health.data.data.database === 'up' ? 'terhubung' : 'terputus'}
            </Badge>
            <span className="text-slate-600">Server berjalan selama {Math.max(1, Math.round(health.data.data.uptime / 60))} menit</span>
          </div>
        )}
      </Card>

      <Card title="Statistik rumah sakit">
        <EmptyState
          title="Belum ada data untuk ditampilkan"
          description="Jumlah pasien, kunjungan, dan bed akan muncul di sini setelah modul Pasien dan Pendaftaran selesai."
        />
      </Card>
    </div>
  );
}
