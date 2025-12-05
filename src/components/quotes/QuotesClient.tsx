'use client';

import { useQuotes } from '@/app/(company)/admin/quotes/quotes-context';
import { QuoteList } from '@/components/quotes/QuoteList';
import { QuoteView } from '@/components/quotes/QuoteView';
import { Quote } from '@/components/quotes/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { QuoteStatus } from '@prisma/client';
import { Archive, CheckCircle, Clock, Download, FileCheck, FileText, Loader2, Mail, MailCheck, MailOpen, MoreVertical, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { exportQuotesToCSV } from '@/lib/export-utils';
import { toast } from 'sonner';
import { QuoteListSkeleton } from './QuoteListSkeleton';

export function QuotesClient() {
  const { 
    quotes, 
    handleSingleAction, 
    handleBulkAction: handleBulkActionFromContext, 
    isLoading, 
    loadMore, 
    hasMore, 
    quoteCounts, 
    statusFilter,
    sortBy,
    searchQuery,
    dateRange
  } = useQuotes();
  
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const selectedQuote = useMemo(() => quotes.find(q => q.id === selectedQuoteId) || null, [quotes, selectedQuoteId]);
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedQuoteIds(prev =>
      prev.includes(id) ? prev.filter(quoteId => quoteId !== id) : [...prev, id]
    );
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedQuoteIds([]);
    setIsAllSelected(false);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedQuoteIds([]);
    }
    else {
      setSelectedQuoteIds(quotes.map(q => q.id));
    }
    setIsAllSelected(prev => !prev);
  }, [isAllSelected, quotes]);

  const handleBulkAction = useCallback(async (action: 'archive' | 'processed' | 'pending' | 'responded' | 'trash' | 'read' | 'unread') => {
    if (selectedQuoteIds.length === 0) {
      toast.info('No quotes selected.');
      return;
    }
    setIsBulkActionLoading(true);
    try {
      await handleBulkActionFromContext(action, selectedQuoteIds);
      handleClearSelection();
    } catch (error) {
      console.error(`Failed to ${action} quotes:`, error);
      toast.error(`Failed to ${action} selected quotes.`);
    } finally {
      setIsBulkActionLoading(false);
    }
  }, [selectedQuoteIds, handleBulkActionFromContext, handleClearSelection]);

  const handleMarkAllAsProcessed = useCallback(async () => {
    setIsBulkActionLoading(true);
    try {
      const pendingQuoteIds = quotes.filter(q => q.status === QuoteStatus.PENDING).map(q => q.id);
      if (pendingQuoteIds.length > 0) {
        await handleBulkActionFromContext('processed', pendingQuoteIds);
        toast.success('All pending quotes marked as processed.');
      } else {
        toast.info('No pending quotes to mark as processed.');
      }
    } catch (error) {
      console.error('Failed to mark all quotes as processed:', error);
      toast.error('Failed to mark all quotes as processed.');
    }
    finally {
      setIsBulkActionLoading(false);
    }
  }, [quotes, handleBulkActionFromContext]);

  const handleMarkAllAsRead = useCallback(async () => {
    setIsBulkActionLoading(true);
    try {
      const unreadQuoteIds = quotes.filter(q => q.status === QuoteStatus.UNREAD).map(q => q.id);
      if (unreadQuoteIds.length > 0) {
        await handleBulkActionFromContext('read', unreadQuoteIds);
        toast.success('All unread quotes marked as read.');
      } else {
        toast.info('No unread quotes to mark as read.');
      }
    } catch (error) {
      console.error('Failed to mark all unread quotes as read:', error);
      toast.error('Failed to mark all unread quotes as read.');
    }
    finally {
      setIsBulkActionLoading(false);
    }
  }, [quotes, handleBulkActionFromContext]);

  const handleSelectQuote = useCallback((id: string) => {
    setSelectedQuoteId(id);
  }, []);

  const onBackClick = useCallback(() => {
    setSelectedQuoteId(null);
  }, []);

  const handleExport = useCallback(async () => {
    setIsBulkActionLoading(true);
    try {
      let quotesToExport: Quote[] = [];

      if (selectedQuoteIds.length > 0) {
        // Export selected only (from client state is fine as they must be loaded to be selected)
        quotesToExport = quotes.filter(q => selectedQuoteIds.includes(q.id));
      } else {
        // Export ALL matching current filters from server
        const { getAllQuotesForExport } = await import('@/app/actions/quote-actions');
        const result = await getAllQuotesForExport(
          statusFilter,
          sortBy,
          searchQuery,
          dateRange.from,
          dateRange.to
        );
        
        if (result.success && result.quotes) {
          quotesToExport = result.quotes;
        } else {
          toast.error('Failed to fetch all quotes for export');
          return;
        }
      }
      
      if (quotesToExport.length > 0) {
        exportQuotesToCSV(quotesToExport);
        toast.success(`Exported ${quotesToExport.length} quotes to CSV`);
        handleClearSelection();
      } else {
        toast.info('No quotes to export');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export quotes');
    } finally {
      setIsBulkActionLoading(false);
    }
  }, [quotes, selectedQuoteIds, handleClearSelection, statusFilter, sortBy, searchQuery, dateRange]);

  const folderDetails = useMemo(() => {
    switch (statusFilter) {
      case 'PENDING':
        return { name: 'Pending', count: quoteCounts.pending };
      case 'PROCESSED':
        return { name: 'Processed', count: quoteCounts.processed };
      case 'RESPONDED':
        return { name: 'Responded', count: quoteCounts.responded };
      case 'ARCHIVED':
        return { name: 'Archived', count: quoteCounts.archived };
      case 'TRASH':
        return { name: 'Trash', count: quoteCounts.trash };
      default:
        return { name: 'All Quotes', count: quoteCounts.total };
    }
  }, [statusFilter, quoteCounts]);

  return (
        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <div className={cn('md:col-span-1 h-full flex flex-col overflow-hidden', selectedQuote && 'hidden md:flex')}>
              <div className="flex flex-col sticky top-0 z-10 bg-background">
                <div className="flex items-center justify-between p-2 border-b">
                  {selectedQuoteIds.length > 0 ? (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 sm:gap-1">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        className="ml-1"
                        aria-label="Select all quotes"
                        disabled={isBulkActionLoading}
                      />
                      <Button variant="ghost" onClick={handleClearSelection} disabled={isBulkActionLoading} className="text-xs">
                        Clear ({selectedQuoteIds.length})
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="icon" onClick={() => handleBulkAction('archive')} disabled={isBulkActionLoading} data-tooltip="Archive">
                        {isBulkActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                        <span className="sr-only">Archive</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleBulkAction('trash')} disabled={isBulkActionLoading} data-tooltip="Trash">
                        {isBulkActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        <span className="sr-only">Trash</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleBulkAction('processed')} disabled={isBulkActionLoading} data-tooltip="Mark as Processed">
                        {isBulkActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        <span className="sr-only">Mark as Processed</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleBulkAction('pending')} disabled={isBulkActionLoading} data-tooltip="Mark as Pending">
                        {isBulkActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                        <span className="sr-only">Mark as Pending</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleBulkAction('read')} disabled={isBulkActionLoading} data-tooltip="Mark as Read">
                        {isBulkActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailOpen className="h-4 w-4" />}
                        <span className="sr-only">Mark as Read</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleBulkAction('unread')} disabled={isBulkActionLoading} data-tooltip="Mark as Unread">
                        {isBulkActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                        <span className="sr-only">Mark as Unread</span>
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="icon" onClick={handleExport} disabled={isBulkActionLoading} data-tooltip="Export CSV">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Export CSV</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground flex-1">
                        {folderDetails.name} ({folderDetails.count})
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isBulkActionLoading} data-tooltip="More actions">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleMarkAllAsProcessed} disabled={isBulkActionLoading}>
                            <FileCheck className="mr-2 h-4 w-4" />
                            <span>Mark all as processed</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleMarkAllAsRead} disabled={isBulkActionLoading}>
                            <MailCheck className="mr-2 h-4 w-4" />
                            <span>Mark all as read</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExport} disabled={isBulkActionLoading}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Export all visible to CSV</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>
              {isLoading && quotes.length === 0 ? (
                <QuoteListSkeleton />
              ) : (
                <> 
                  <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <QuoteList
                        quotes={quotes}
                        selectedQuoteId={selectedQuoteId}
                        setSelectedQuoteId={handleSelectQuote}
                        selectedQuoteIds={selectedQuoteIds}
                        onToggleSelect={handleToggleSelect}
                        isLoading={isLoading}
                    />
                  </div>
                  {hasMore && (
                    <div className="p-3 border-t shrink-0">
                        <Button 
                            variant="outline" 
                            onClick={loadMore} 
                            disabled={isLoading}
                            className="w-full h-8 text-xs"
                        >
                            {isLoading ? 'Loading...' : 'Load More'}
                        </Button>
                    </div>
                  )}
                </>
              )}
            </div>
              {/* Quote Detail View - 2 columns */}
            <div className={cn('md:col-span-2 h-full flex flex-col', !selectedQuote && 'hidden md:flex')}>
              {selectedQuote ? (
                <QuoteView 
                  quote={selectedQuote} 
                  onBackClick={onBackClick} 
                  onAction={handleSingleAction} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center sticky top-80 h-100vh text-muted-foreground p-8 text-center !bg-muted/40">
                  <div className="bg-muted/50 p-4 rounded-full mb-4">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Quote Selected</h3>
                  <p className="text-sm max-w-sm mx-auto">
                    Select a quote request from the list to review details, send a reply, or update its status.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TooltipProvider>
  );
}