import { Link } from 'react-router-dom';
import { PlusCircle, Search, Pill, Wallet } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { QuickAction } from '../dashboard.types';

interface QuickActionsProps {
  actions: QuickAction[];
}

const ICONS = {
  plus: PlusCircle,
  search: Search,
  pill: Pill,
  wallet: Wallet,
};

const TONE_BG: Record<string, string> = {
  primary: 'bg-primary-50 text-primary-600 group-hover:bg-primary-100',
  sky: 'bg-sky-50 text-sky-600 group-hover:bg-sky-100',
  amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => {
        const Icon = ICONS[action.icon];
        return (
          <Link
            key={action.label}
            to={action.href}
            className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:border-primary-200 hover:shadow-md"
          >
            <div
              className={cn(
                'grid h-12 w-12 place-items-center rounded-lg transition',
                TONE_BG[action.tone],
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{action.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{action.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}