
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function ProductsLoading() {
  return (
    <div className="h-[calc(100vh-60px)] overflow-hidden">
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
        {/* Sidebar Skeleton */}
        <div className="hidden md:flex flex-col gap-4 p-4 border-r">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-col h-full">
          {/* Product List Skeleton */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>

          <Separator />

          {/* Product View Skeleton */}
          <div className="p-6 flex-shrink-0">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">Select a product to view details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
