import { Skeleton } from '@/components/ui/skeleton';

export function QuoteItemSkeleton() {
  return (
    <div className="flex w-full items-start gap-3 p-3 rounded-lg border bg-card">
      {/* Checkbox skeleton */}
      <div className="flex items-center h-full pt-1">
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      
      {/* Content skeleton */}
      <div className="flex flex-col gap-2 w-full">
        {/* Name and timestamp row */}
        <div className="flex flex-row items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        
        {/* Company and product info */}
        <div className="flex gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
        
        {/* Message preview */}
        <Skeleton className="h-3 w-full max-w-md" />
        
        {/* Status badge */}
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function QuoteListSkeleton() {
  return (
    <div className="flex flex-col w-full gap-2 p-2">
      <QuoteItemSkeleton />
      <QuoteItemSkeleton />
      <QuoteItemSkeleton />
      <QuoteItemSkeleton />
      <QuoteItemSkeleton />
    </div>
  );
}
