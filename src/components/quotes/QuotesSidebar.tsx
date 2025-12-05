'use client';

import { Archive, CheckCircle, Clock, FileText, MessageSquareReply, Package2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { QuoteStatusFilter, useQuotes } from '@/app/(company)/admin/quotes/quotes-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';

export function QuotesSidebar() {
  const pathname = usePathname();
  const { statusFilter, setStatusFilter, quoteCounts } = useQuotes();

  const handleStatusFilterChange = (filter: QuoteStatusFilter) => {
    setStatusFilter(filter);
  };

  return (
    <TooltipProvider>
      <div className="hidden border-r bg-muted/40 md:block md:sticky md:top-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 lg:h-[60px] items-center border-b px-4 lg:px-6 shrink-0">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-4 w-4" />
              <span className="text-sm">Quotes</span>
            </Link>
          </div>

          {/* Content - with hidden scrollbar */}
          <div 
            className="overflow-y-auto px-2 py-3 text-sm font-medium lg:px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-border/80 [scrollbar-width:thin]" 
            style={{ height: 'calc(100vh - 216px)' }}
          >
            <nav className="space-y-1">
              <Link
                href="/admin/quotes"
                className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                  pathname === '/admin/quotes' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <FileText className="h-4 w-4" />
                All Quotes
                <Badge id="all-quotes-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {quoteCounts.total}
                </Badge>
              </Link>
              <Link
                href="/admin/quotes/pending"
                className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                  pathname === '/admin/quotes/pending' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <Clock className="h-4 w-4" />
                Pending
                <Badge id="pending-quotes-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {quoteCounts.pending}
                </Badge>
              </Link>
              <Link
                href="/admin/quotes/processed"
                className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                  pathname === '/admin/quotes/processed' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                Processed
                <Badge id="processed-quotes-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {quoteCounts.processed}
                </Badge>
              </Link>
              <Link
                href="/admin/quotes/responded"
                className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                  pathname === '/admin/quotes/responded' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <MessageSquareReply className="h-4 w-4" />
                Responded
                <Badge id="responded-quotes-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {quoteCounts.responded}
                </Badge>
              </Link>
              <Link
                href="/admin/quotes/archived"
                className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                  pathname === '/admin/quotes/archived' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <Archive className="h-4 w-4" />
                Archived
                <Badge id="archived-quotes-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {quoteCounts.archived}
                </Badge>
              </Link>
              <Link
                href="/admin/quotes/trash"
                className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                  pathname === '/admin/quotes/trash' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Trash
                <Badge id="trash-quotes-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {quoteCounts.trash}
                </Badge>
              </Link>
            </nav>

            <div className="mt-6 pt-4 border-t">
              <h3 className="mb-3 px-3 text-xs font-semibold text-muted-foreground">Filter by Status</h3>
              <div className="space-y-1">
                <Button
                  variant={statusFilter === 'ALL' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start capitalize text-xs h-9"
                  onClick={() => handleStatusFilterChange('ALL')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'UNREAD' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-xs gap-2 h-9"
                  onClick={() => handleStatusFilterChange('UNREAD')}
                >
                  Unread
                  <Badge id="unread-quotes-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {quoteCounts.unread}
                  </Badge>
                </Button>
                <Button
                  variant={statusFilter === 'READ' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-xs gap-2 h-9"
                  onClick={() => handleStatusFilterChange('READ')}
                >
                  Read
                  <Badge id="read-quotes-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {quoteCounts.read}
                  </Badge>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
