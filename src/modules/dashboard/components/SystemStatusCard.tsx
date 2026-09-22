import { Badge, Button, Card } from '@/shared/components/ui';
import { LoadingState, ErrorState } from '@/shared/components/feedback';
import { getErrorMessage } from '@/lib/api';
import { useReadiness } from '../dashboard.hooks';

function formatUptime(seconds: number) {
  const totalMinutes = Math.floor(seconds / 60);
  if (totalMinutes < 60) return `${Math.max(1, totalMinutes)} menit`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours < 24) return `${hours} jam ${minutes} menit`;
  const days = Math.floor(hours / 24);
  return `${days} hari ${hours % 24} jam`;
}

export function SystemStatusCard() {
  const health = useReadiness();

  return (
    <Card
      title="Status sistem"
      description="Pemeriksaan API dan database PostgreSQL secara berkala."
      action={
        <Button
          variant="secondary"
          size="sm"
          loading={health.isFetching}
          onClick={() => health.refetch()}
        >
          Periksa ulang
        </Button>
      }
    >
      {health.isLoading && <LoadingState label="Memeriksa koneksi…" />}

      {health.isError && (
        <ErrorState
          message={getErrorMessage(health.error)}
          onRetry={() => health.refetch()}
        />
      )}

      {health.data && (
        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <span className="text-sm text-slate-700">API</span>
            <Badge tone="success">Aktif</Badge>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-700">Database PostgreSQL</span>
            <Badge
              tone={health.data.database === 'up' ? 'success' : 'danger'}
            >
              {health.data.database === 'up' ? 'Terhubung' : 'Terputus'}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-3 last:pb-0">
            <span className="text-sm text-slate-700">Uptime server</span>
            <span className="text-sm font-medium text-slate-900">
              {formatUptime(health.data.uptime)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}