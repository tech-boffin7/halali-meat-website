'use client';

import { updateQuoteStatus } from '@/app/actions/quote-actions';
import { QuoteView } from '@/components/quotes/QuoteView';
import { cn } from '@/lib/utils';
import { Archive } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { QuoteList } from './QuoteList';
import { Quote } from './types';

export function ArchivedQuotesClient({ initialQuotes }: { initialQuotes: Quote[] }) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const selectedQuote = useMemo(() => quotes.find(q => q.id === selectedQuoteId) || null, [quotes, selectedQuoteId]);
  const [searchQuery] = useState('');

  const handleAction = async (action: string, id: string) => {
    if (action === 'unarchive') {
        const result = await updateQuoteStatus(id, 'PENDING');
      if (result.success) {
        setQuotes(prev => prev.filter(q => q.id !== id));
        setSelectedQuoteId(null);
        toast.success('Quote unarchived and moved to pending.');
      } else {
        const errorMessage = 'message' in result ? result.message : 'Failed to unarchive quote.';
        toast.error(errorMessage);
      }
    }
  };

  const filteredQuotes = useMemo(() => {
    if (!searchQuery) return quotes;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return quotes.filter(
      (quote) =>
        quote.name.toLowerCase().includes(lowerCaseQuery) ||
        quote.email.toLowerCase().includes(lowerCaseQuery)
    );
  }, [quotes, searchQuery]);

  return (
    <div className="grid lg:grid-cols-2 gap-4 h-full">
      <div className={cn('h-full', selectedQuote && 'hidden lg:block')}>
        <QuoteList
          quotes={filteredQuotes}
          selectedQuoteId={selectedQuoteId}
          setSelectedQuoteId={setSelectedQuoteId}
          selectedQuoteIds={[]}
          onToggleSelect={() => {}}
          isLoading={false}
        />
      </div>
      <div className={cn('h-full', !selectedQuote && 'hidden lg:block')}>
        {selectedQuote ? (
          <QuoteView
            quote={selectedQuote}
            onBackClick={() => setSelectedQuoteId(null)}
            onAction={handleAction}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center bg-muted/40 border rounded-lg">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <Archive className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Archived Quote Selected</h3>
            <p className="text-sm max-w-sm mx-auto">
              Select an archived quote from the list to view its history and details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}