import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './EmptyState';
import { QuoteItem } from './QuoteItem';
import { Quote } from './types';

interface QuoteListProps {
  quotes: Quote[];
  selectedQuoteId: string | null;
  setSelectedQuoteId: (id: string) => void;
  selectedQuoteIds: string[];
  onToggleSelect: (id: string) => void;
  searchQuery?: string;
  isLoading: boolean;
}

export function QuoteList({ quotes, selectedQuoteId, setSelectedQuoteId, selectedQuoteIds, onToggleSelect, searchQuery, isLoading }: QuoteListProps) {

  if (quotes.length === 0 && !isLoading) {
    return <EmptyState searchQuery={searchQuery} />;
  }

  return (
    <div className="flex flex-col w-full gap-2">
      {quotes.map((quote, index) => (
        <QuoteItem 
          key={quote.id} 
          quote={quote} 
          onSelect={() => setSelectedQuoteId(quote.id)} 
          selected={selectedQuoteId === quote.id} 
          onToggle={() => onToggleSelect(quote.id)}
          isChecked={selectedQuoteIds.includes(quote.id)}
          index={index} 
        />
      ))}
      {isLoading && quotes.length > 0 && (
        <div className="space-y-2 p-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
    </div>
  );
}