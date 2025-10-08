
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardLoading() {
  return (
    <DashboardShell
      title="Admin Dashboard"
      description="Overview of your business operations."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[450px] col-span-1 lg:col-span-2" />
        <div className="grid gap-6">
          <Skeleton className="h-[217px]" />
          <Skeleton className="h-[217px]" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>

      <div className="mt-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </DashboardShell>
  );
}
