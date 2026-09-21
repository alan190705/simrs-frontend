import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps { message: string; onRetry?: () => void }

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 py-2">
      <p className="flex items-start gap-2 text-sm text-red-800">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden /> {message}
      </p>
      {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Coba lagi</Button>}
    </div>
  );
}
