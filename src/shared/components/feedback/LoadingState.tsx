interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Memuat…' }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
      <svg
        className="h-4 w-4 animate-spin text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {label}
    </div>
  );
}