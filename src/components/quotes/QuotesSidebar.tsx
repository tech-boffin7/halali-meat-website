import { Bell, Package2, FileText, Archive } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuoteFilter } from '@/app/(company)/admin/quotes/quote-filter-context';

export function QuotesSidebar() {
  const pathname = usePathname();
  const { statusFilter, setStatusFilter } = useQuoteFilter();

  const handleStatusFilterChange = (filter: 'all' | 'pending' | 'processed') => {
    setStatusFilter(filter);
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-4 w-4" />
            <span className="text-sm">Quotes</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/admin/quotes"
              className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === '/admin/quotes' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <FileText className="h-4 w-4" />
              All Quotes
              <Badge className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                12
              </Badge>
            </Link>
            {/* Add more links for Pending, Processed, Archived quotes here */}
            <Link
              href="/admin/quotes/archived" // Placeholder for archived quotes
              className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === '/admin/quotes/archived' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <Archive className="h-4 w-4" />
              Archived
            </Link>
          </nav>
          <div className="mt-4 px-2 lg:px-4">
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Filter by Status</h3>
            <div className="grid gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start capitalize"
                onClick={() => handleStatusFilterChange('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start capitalize"
                onClick={() => handleStatusFilterChange('pending')}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'processed' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start capitalize"
                onClick={() => handleStatusFilterChange('processed')}
              >
                Processed
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
