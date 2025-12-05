import { Skeleton } from '@/components/ui/skeleton';

export function ProductItemSkeleton() {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="flex flex-col h-full bg-card border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
