type Props = {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
};

export function Skeleton({ className = '', rounded = 'md' }: Props) {
  const r = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  return (
    <span
      className={`inline-block animate-pulse bg-border-2/50 ${r} ${className}`}
      aria-hidden
    />
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card p-5" aria-hidden>
      <Skeleton className="block h-5 w-3/4 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`block h-3 mb-2 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
