'use client';

import { getQuotesAction, updateMultipleQuoteStatus, updateQuoteStatus } from '@/app/actions/quote-actions';
import { Quote } from '@/components/quotes/types';
import { QuoteCounts } from '@/lib/definitions';
import { QuoteStatus } from '@prisma/client';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { QUOTES_PER_PAGE } from '@/lib/constants';

interface QuotesContextType {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  quoteCounts: QuoteCounts;
  isLoading: boolean;
  handleSingleAction: (action: 'archive' | 'trash' | 'read' | 'unread' | 'pending' | 'processed' | 'responded' | 'unarchive', id: string) => Promise<void>;
  handleBulkAction: (action: 'archive' | 'trash' | 'read' | 'unread' | 'pending' | 'processed' | 'responded', ids: string[]) => Promise<void>;
  loadMore: () => void;
  hasMore: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  statusFilter: QuoteStatusFilter;
  setStatusFilter: (filter: QuoteStatusFilter) => void;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export type QuoteStatusFilter = 'ALL' | 'UNREAD' | 'READ' | 'PENDING' | 'PROCESSED' | 'RESPONDED' | 'ARCHIVED' | 'TRASH';

export function QuotesProvider({ children, initialStatusFilter }: { children: ReactNode; initialStatusFilter?: QuoteStatusFilter }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [quoteCounts, setQuoteCounts] = useState<QuoteCounts>({
    total: 0,
    unread: 0,
    read: 0,
    pending: 0,
    processed: 0,
    responded: 0,
    archived: 0,
    trash: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [statusFilter, setStatusFilter] = useState<QuoteStatusFilter>(initialStatusFilter || 'ALL');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const fetchQuotesAndCounts = useCallback(async (pageNum: number, shouldRefresh: boolean) => {
    setIsLoading(true);
    try {
      const response = await getQuotesAction(
        pageNum, 
        QUOTES_PER_PAGE, 
        statusFilter, 
        sortBy, 
        debouncedSearchQuery,
        dateRange.from,
        dateRange.to
      );

      if (response.success) {
        setQuotes(prev => shouldRefresh ? (response.quotes || []) : [...prev, ...(response.quotes || [])]);
        setHasMore((response.quotes?.length || 0) === QUOTES_PER_PAGE);
        if (response.counts) {
          setQuoteCounts(response.counts as QuoteCounts);
        }
      } else {
        toast.error(response.message || 'Failed to fetch quotes.');
        setQuotes([]);
        setHasMore(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, sortBy, debouncedSearchQuery, dateRange.from, dateRange.to]);

  useEffect(() => {
    setPage(1);
    fetchQuotesAndCounts(1, true);
  }, [fetchQuotesAndCounts]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchQuotesAndCounts(nextPage, false);
    }
  }, [isLoading, hasMore, page, fetchQuotesAndCounts]);

  const getPastTense = (action: string) => {
    const irregularVerbs: { [key: string]: string } = {
      read: 'read',
      unread: 'unread',
      pending: 'marked as pending',
      processed: 'processed',
    };
    if (irregularVerbs[action]) {
      return irregularVerbs[action];
    }
    if (action.endsWith('e')) {
      return action + 'd';
    }
    if (action.endsWith('y')) {
      return action.slice(0, -1) + 'ied';
    }
    return action + 'ed';
  };

  const getStatusFromAction = (action: string): QuoteStatus => {
    switch (action) {
        case 'unarchive':
            return QuoteStatus.PENDING;
        case 'archive':
            return QuoteStatus.ARCHIVED;
        case 'trash':
            return QuoteStatus.TRASH;
        case 'read':
            return QuoteStatus.READ;
        case 'unread':
            return QuoteStatus.UNREAD;
        case 'pending':
            return QuoteStatus.PENDING;
        case 'processed':
            return QuoteStatus.PROCESSED;
        case 'responded':
            return QuoteStatus.RESPONDED;
        default:
            throw new Error(`Invalid action: ${action}`);
    }
  }

  const handleSingleAction = useCallback(async (action: 'archive' | 'trash' | 'read' | 'unread' | 'pending' | 'processed' | 'responded' | 'unarchive', id: string) => {
    const newStatus = getStatusFromAction(action);
    
    let originalQuotes: Quote[] = [];
    setQuotes(prev => {
      originalQuotes = prev;
      if (['read', 'unread', 'pending', 'processed', 'responded'].includes(action)) {
        return prev.map(q => q.id === id ? { ...q, status: newStatus } : q);
      } else {
        return prev.filter(q => q.id !== id);
      }
    });
    
    const result = await updateQuoteStatus(id, newStatus);

    if (result.success) {
      const pastTenseAction = getPastTense(action);
      toast.success(`Quote ${pastTenseAction} successfully!`);
      if (result.counts) {
        setQuoteCounts(result.counts as QuoteCounts);
      }
    } else {
      toast.error(`Failed to ${action} quote.`);
      setQuotes(originalQuotes);
    }
  }, []);

  const handleBulkAction = useCallback(async (action: 'archive' | 'trash' | 'read' | 'unread' | 'pending' | 'processed' | 'responded', ids: string[]) => {
    const newStatus = getStatusFromAction(action);

    let originalQuotes: Quote[] = [];
    setQuotes(prev => {
        originalQuotes = prev;
        if (['read', 'unread', 'pending', 'processed', 'responded'].includes(action)) {
            return prev.map(q => ids.includes(q.id) ? { ...q, status: newStatus } : q);
        } else {
            return prev.filter(q => !ids.includes(q.id));
        }
    });

    const result = await updateMultipleQuoteStatus(ids, newStatus);

    if (result.success) {
      const pastTenseAction = getPastTense(action);
      toast.success(`Quotes ${pastTenseAction} successfully!`);
      if (result.counts) {
        setQuoteCounts(result.counts as QuoteCounts);
      }
    } else {
      toast.error(`Failed to ${action} quotes.`);
      setQuotes(originalQuotes);
    }
  }, []);

  const contextValue = useMemo(() => ({
    quotes,
    setQuotes,
    quoteCounts,
    isLoading,
    handleSingleAction,
    handleBulkAction,
    loadMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange
  }), [
    quotes,
    quoteCounts,
    isLoading,
    handleSingleAction,
    handleBulkAction,
    loadMore,
    hasMore,
    searchQuery,
    sortBy,
    statusFilter,
    dateRange
  ]);

  return (
    <QuotesContext.Provider value={contextValue}>
      {children}
    </QuotesContext.Provider>
  );
}

export function useQuotes() {
  const context = useContext(QuotesContext);
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  return context;
}
