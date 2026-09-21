import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps { title?: string; description?: string; action?: ReactNode; className?: string; children: ReactNode }

export function Card({ title, description, action, className, children }: CardProps) {
  return (
    <section className={cn('rounded-lg border border-slate-200 bg-white', className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-600">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
