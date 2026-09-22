import { Link } from 'react-router-dom';
import { EmptyState } from '@/shared/components/feedback';
import { Card } from '@/shared/components/ui';
import type { NavItem } from '@/app/navigation';

export function ModulePlaceholder({ item }: { item: NavItem }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{item.label}</h1>
      <Card>
        <EmptyState
          title={`Modul ${item.label} belum tersedia`}
          description={`Dikerjakan pada ${item.phase}.`}
          action={<Link to="/dashboard" className="text-sm font-medium text-brand-700 underline">Kembali ke dashboard</Link>}
        />
      </Card>
    </div>
  );
}
