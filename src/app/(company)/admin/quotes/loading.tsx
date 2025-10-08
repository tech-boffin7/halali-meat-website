
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function QuotesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <div className="md:col-span-1 h-full overflow-y-auto overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Product Interest</TableHead>
              <TableHead className="text-xs text-center">Status</TableHead>
              <TableHead className="text-right text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:col-span-2 h-full hidden md:block">
        <div className="flex bg-secondary items-center justify-center h-full text-muted-foreground">
          <p className="text-sm">Select a quote to view details</p>
        </div>
      </div>
    </div>
  );
}
