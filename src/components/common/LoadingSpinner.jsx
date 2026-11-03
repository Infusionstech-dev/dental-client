import { cn } from '../../utils/format';

const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-[3px]', lg: 'h-12 w-12 border-4' };

export default function LoadingSpinner({ size = 'md', className, label }) {
  return (
    <span role="status" className="inline-flex items-center gap-3">
      <span className={cn('animate-spin rounded-full border-current border-r-transparent text-brand-600', sizes[size], className)} />
      {label ? <span className="text-sm text-navy-500">{label}</span> : <span className="sr-only">Loading</span>}
    </span>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" label="Loading…" />
    </div>
  );
}
