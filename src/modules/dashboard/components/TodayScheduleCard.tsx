import { Clock, CheckCircle2, PlayCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { TodaySchedule } from '../dashboard.types';

interface TodayScheduleCardProps {
  schedules: TodaySchedule[];
}

const STATUS_CONFIG = {
  ongoing: {
    label: 'Sedang Praktek',
    icon: PlayCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  done: {
    label: 'Selesai',
    icon: CheckCircle2,
    color: 'text-slate-400',
    bg: 'bg-slate-50',
  },
  upcoming: {
    label: 'Akan Datang',
    icon: Circle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
};

// Generate warna avatar dari nama dokter
function getAvatarColor(name: string) {
  const colors = [
    'bg-primary-500',
    'bg-sky-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-indigo-500',
  ];
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function getInitials(name: string) {
  return name
    .replace(/^dr\.\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function TodayScheduleCard({ schedules }: TodayScheduleCardProps) {
  if (schedules.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Tidak ada jadwal dokter hari ini.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {schedules.map((s) => {
        const percent = Math.round((s.booked / s.capacity) * 100);
        const isFull = s.booked >= s.capacity;
        const status = STATUS_CONFIG[s.status];
        const StatusIcon = status.icon;

        return (
          <div key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            {/* Jam */}
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Clock className="h-3.5 w-3.5" />
              <span className="mt-0.5 text-[10px] font-semibold">{s.time}</span>
            </div>

            {/* Avatar dokter */}
            <div
              className={cn(
                'grid h-9 w-9 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white',
                getAvatarColor(s.doctorName),
              )}
            >
              {getInitials(s.doctorName)}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {s.doctorName}
              </p>
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs text-slate-500">{s.polyclinic}</p>
                <span className="text-xs text-slate-300">·</span>
                <span className={cn('flex items-center gap-1 text-xs font-medium', status.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="w-24 text-right">
              <p className="text-xs font-medium text-slate-600">
                {s.booked}/{s.capacity}
              </p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isFull ? 'bg-red-500' : percent > 70 ? 'bg-amber-500' : 'bg-emerald-500',
                  )}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}