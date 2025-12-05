
import { Skeleton } from '@/components/ui/skeleton';

export default function QuotesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <div className="md:col-span-1 h-full overflow-y-auto overflow-x-auto scrollbar-thin">
        <div className="flex flex-col gap-2 p-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <div className="md:col-span-2 h-full hidden md:block">
        <div className="flex bg-secondary items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">Select a quote to view</p>
        </div>
      </div>
    </div>
  );
}
