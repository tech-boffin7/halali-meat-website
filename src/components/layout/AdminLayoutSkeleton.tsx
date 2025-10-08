
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function AdminLayoutSkeleton() {
  return (
    <div className="flex min-h-screen bg-background dark:bg-secondary/50">
      {/* Sidebar Skeleton */}
      <aside className={cn("hidden md:flex flex-col border-r border-border/50 transition-all duration-300 ease-in-out w-64")}>
        <div className={cn("flex items-center justify-between h-16 border-b p-4")}>
          <Skeleton className="h-6 w-32 ml-2" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="flex-grow p-2 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-auto p-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>

      {/* Main content area Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden p-2">
        <main className="flex-1 overflow-auto">
            <div className="p-6">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-4 w-96" />
            </div>
        </main>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
