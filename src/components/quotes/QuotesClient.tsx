'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Archive, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { QuoteView } from '@/components/quotes/QuoteView';
import { useSearch } from '@/app/(company)/admin/messages/search-context';
import { useQuoteFilter } from '@/app/(company)/admin/quotes/quote-filter-context';

interface Quote {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  productInterest: string;
  quantity: string;
  message?: string;
  status: 'pending' | 'processed';
  isArchived?: boolean;
}

interface QuoteListProps {
  quotes: Quote[];
  selectedQuote: Quote | null;
  setSelectedQuote: (quote: Quote | null) => void;
  onUpdateStatus: (id: string, status: 'processed') => void;
  onArchive: (id: string, archive: boolean) => void;
  onDelete: (id: string) => void;
}

function QuoteList({ quotes, selectedQuote, setSelectedQuote, onUpdateStatus, onArchive, onDelete }: QuoteListProps) {
  if (quotes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No quote requests found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto overflow-x-auto scrollbar-thin">
      <Table>
        <TableHeader className='bg-secondary'>
          <TableRow>
            <TableHead className="text-xs">Date</TableHead>
            <TableHead className="text-xs">Name</TableHead>
            <TableHead className="text-xs">Product Interest</TableHead>
            <TableHead className="text-xs text-center">Status</TableHead>
            <TableHead className="text-right text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow
              key={quote.id}
              onClick={() => setSelectedQuote(quote)}
              className={cn(
                "cursor-pointer",
                selectedQuote?.id === quote.id && "bg-muted"
              )}
            >
              <TableCell className="text-xs">{new Date(quote.timestamp).toLocaleDateString()}</TableCell>
              <TableCell className="text-xs">{quote.name}</TableCell>
              <TableCell className="text-xs">{quote.productInterest}</TableCell>
              <TableCell className="text-xs">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  quote.status === 'pending' ? 'bg-secondary text-secondary-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  {quote.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(quote.id, 'processed');
                  }}
                  disabled={quote.status === 'processed'}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(quote.id, true);
                  }}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(quote.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function QuotesClient({ initialQuotes }: { initialQuotes: Quote[] }) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const { searchQuery } = useSearch();
  const { statusFilter } = useQuoteFilter();

  const handleUpdateStatus = (id: string, status: 'processed') => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
    toast.success('Quote status updated.');
  };

  const handleArchive = (id: string, archive: boolean) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, isArchived: archive } : q));
    setSelectedQuote(null);
    toast.success(archive ? 'Quote archived.' : 'Quote un-archived.');
  };

  const handleDeleteQuote = (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    setQuotes(quotes.filter(q => q.id !== id));
    setSelectedQuote(null);
    toast.success('Quote deleted successfully');
  };

  const filteredQuotes = useMemo(() => {
    let currentQuotes = quotes.filter(q => !q.isArchived);

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentQuotes = currentQuotes.filter(
        (quote) =>
          quote.name.toLowerCase().includes(lowerCaseQuery) ||
          quote.email.toLowerCase().includes(lowerCaseQuery) ||
          quote.productInterest.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (statusFilter !== 'all') {
      currentQuotes = currentQuotes.filter((quote) => quote.status === statusFilter);
    }

    return currentQuotes;
  }, [quotes, searchQuery, statusFilter]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <div className={cn('md:col-span-1 h-full overflow-y-auto overflow-x-auto scrollbar-thin', selectedQuote && 'hidden md:block')}>
        <QuoteList
          quotes={filteredQuotes}
          selectedQuote={selectedQuote}
          setSelectedQuote={setSelectedQuote}
          onUpdateStatus={handleUpdateStatus}
          onArchive={handleArchive}
          onDelete={handleDeleteQuote}
        />
      </div>
      <div className={cn('md:col-span-2 h-full', !selectedQuote && 'hidden md:block')}>
        {selectedQuote ? (
          <QuoteView
            quote={selectedQuote}
            onBackClick={() => setSelectedQuote(null)}
            onUpdateStatus={handleUpdateStatus}
            onArchive={handleArchive}
            onDelete={handleDeleteQuote}
          />
        ) : (
          <div className="flex bg-secondary text-sm items-center justify-center h-full text-muted-foreground">
            <p>Select a quote to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
