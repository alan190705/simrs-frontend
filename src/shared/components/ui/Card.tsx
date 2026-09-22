import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md';
}

export function Card({
  title,
  description,
  action,
  children,
  className,
  padding = 'md',
}: CardProps) {
  const hasHeader = title || description || action;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
        className,
      )}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div
        className={cn(
          padding === 'md' && 'px-6 py-5',
          padding === 'sm' && 'px-4 py-3',
          padding === 'none' && '',
        )}
      >
        {children}
      </div>
    </div>
  );
}