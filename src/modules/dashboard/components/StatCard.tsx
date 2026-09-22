import { Users, Bed, PlusCircle, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { DashboardStat } from '../dashboard.types';

interface StatCardProps {
  stat: DashboardStat;
}

const ICONS = {
  users: Users,
  bed: Bed,
  plus: PlusCircle,
  calendar: Calendar,
};

const TONE: Record<
  string,
  { bg: string; text: string; ring: string; gradient: string }
> = {
  primary: {
    bg: 'bg-primary-50',
    text: 'text-primary-600',
    ring: 'ring-primary-100',
    gradient: 'from-primary-500/5 to-transparent',
  },
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    ring: 'ring-sky-100',
    gradient: 'from-sky-500/5 to-transparent',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    ring: 'ring-amber-100',
    gradient: 'from-amber-500/5 to-transparent',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    ring: 'ring-emerald-100',
    gradient: 'from-emerald-500/5 to-transparent',
  },
};

export function StatCard({ stat }: StatCardProps) {
  const Icon = ICONS[stat.icon];
  const tone = TONE[stat.tone];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      {/* Gradient tipis di background */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-100',
          tone.gradient,
        )}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'grid h-12 w-12 place-items-center rounded-xl ring-4',
              tone.bg,
              tone.text,
              tone.ring,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          {stat.trend && (
            <div
              className={cn(
                'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                stat.trend.direction === 'up'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700',
              )}
            >
              {stat.trend.direction === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {stat.trend.value}%
            </div>
          )}
        </div>

        <p className="mt-4 text-sm font-medium text-slate-500">{stat.label}</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-900">
          {stat.value}
        </p>
        {stat.hint && <p className="mt-1 text-xs text-slate-400">{stat.hint}</p>}
      </div>
    </div>
  );
}