
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
      </div>

      <div className="flex justify-center gap-2 mb-10">
        <Button variant='ghost' disabled>All</Button>
        <Button variant='ghost' disabled>Frozen</Button>
        <Button variant='ghost' disabled>Chilled</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-card border border-border/50 rounded-lg overflow-hidden shadow-sm flex flex-col">
            <Skeleton className="h-60 w-full" />
            <div className="p-5 flex flex-col flex-grow">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <div className="flex items-center gap-2 mb-5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-10 w-full mt-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
