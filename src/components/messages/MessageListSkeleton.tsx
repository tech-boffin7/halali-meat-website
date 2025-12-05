import { Skeleton } from '@/components/ui/skeleton';

export function MessageListSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-3 p-2 rounded-lg border">
          <Skeleton className="h-5 w-5 rounded mt-1" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
