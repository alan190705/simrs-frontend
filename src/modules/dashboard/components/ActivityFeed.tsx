import { UserPlus, Pill, Wallet, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Activity } from '../dashboard.types';

interface ActivityFeedProps {
  activities: Activity[];
}

const ICONS = {
  patient: UserPlus,
  prescription: Pill,
  payment: Wallet,
  registration: ClipboardCheck,
};

const TONE_BG: Record<string, string> = {
  primary: 'bg-primary-50 text-primary-600',
  sky: 'bg-sky-50 text-sky-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Belum ada aktivitas hari ini.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((act) => {
        const Icon = ICONS[act.type];
        return (
          <div key={act.id} className="flex items-start gap-3">
            <div
              className={cn(
                'grid h-9 w-9 shrink-0 place-items-center rounded-lg',
                TONE_BG[act.tone],
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-900">
                <span className="font-medium">{act.title}</span>
              </p>
              <p className="truncate text-xs text-slate-500">{act.description}</p>
            </div>
            <span className="shrink-0 text-xs text-slate-400">{act.timestamp}</span>
          </div>
        );
      })}
    </div>
  );
}