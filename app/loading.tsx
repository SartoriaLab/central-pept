import { Skeleton, SkeletonList } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14" role="status" aria-label="Carregando">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-10 w-2/3 mb-4 block" rounded="lg" />
      <Skeleton className="h-5 w-1/2 mb-10 block" />
      <SkeletonList count={6} />
    </div>
  );
}
