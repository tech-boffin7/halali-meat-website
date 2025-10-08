'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { ArchiveRestore, Trash2 } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

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

interface ArchivedQuoteListProps {
  quotes: Quote[];
  selectedQuote: Quote | null;
  setSelectedQuote: (quote: Quote | null) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (ids: string[]) => void;
  selectedIds: string[];
}

function ArchivedQuoteList({ quotes, selectedQuote, setSelectedQuote, onUnarchive, onDelete, onSelect, selectedIds }: ArchivedQuoteListProps) {
  if (quotes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No archived quotes found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-secondary">
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedIds.length === quotes.length && quotes.length > 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSelect(quotes.map(q => q.id));
                } else {
                  onSelect([]);
                }
              }}
            />
          </TableHead>
          <TableHead className="text-xs">Date</TableHead>
          <TableHead className="text-xs">Name</TableHead>
          <TableHead className="text-xs">Product Interest</TableHead>
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
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedIds.includes(quote.id)}
                onCheckedChange={() => {
                  const newSelectedIds = selectedIds.includes(quote.id)
                    ? selectedIds.filter(id => id !== quote.id)
                    : [...selectedIds, quote.id];
                  onSelect(newSelectedIds);
                }}
              />
            </TableCell>
            <TableCell className="text-xs">{new Date(quote.timestamp).toLocaleDateString()}</TableCell>
            <TableCell className="text-xs">{quote.name}</TableCell>
            <TableCell className="text-xs">{quote.productInterest}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUnarchive(quote.id);
                }}
              >
                <ArchiveRestore className="h-4 w-4" />
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
  );
}

export function ArchivedQuotesClient({ initialQuotes }: { initialQuotes: Quote[] }) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { searchQuery } = useSearch();

  const handleArchive = (id: string, archive: boolean) => {
    // This is a mock implementation. In a real app, you would make an API call.
    const newQuotes = quotes.filter(q => q.id !== id);
    setQuotes(newQuotes);
    setSelectedQuote(null);
    toast.success(archive ? 'Quote archived.' : 'Quote un-archived.');
  };

  const handleDelete = (ids: string[]) => {
    if (!confirm(`Are you sure you want to permanently delete ${ids.length} quote(s)?`)) return;
    setQuotes(quotes.filter(q => !ids.includes(q.id)));
    setSelectedIds([]);
    setSelectedQuote(null);
    toast.success(`${ids.length} quote(s) have been deleted.`);
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter(
      (quote) =>
        quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.productInterest.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [quotes, searchQuery]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <div className={cn('md:col-span-1 h-full overflow-y-auto', selectedQuote && 'hidden md:block')}>
        {selectedIds.length > 0 && (
          <div className="p-2 bg-secondary flex items-center gap-2">
            <span className="text-sm font-medium">{selectedIds.length} selected</span>
            <Button variant="outline" size="sm" onClick={() => handleArchive(selectedIds.join(','), false)}>
              <ArchiveRestore className="mr-2 h-4 w-4" /> Un-archive
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedIds)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        )}
        <ArchivedQuoteList
          quotes={filteredQuotes}
          selectedQuote={selectedQuote}
          setSelectedQuote={setSelectedQuote}
          onUnarchive={(id) => handleArchive(id, false)}
          onDelete={(id) => handleDelete([id])}
          onSelect={setSelectedIds}
          selectedIds={selectedIds}
        />
      </div>
      <div className={cn('md:col-span-2 h-full', !selectedQuote && 'hidden md:block')}>
        {selectedQuote ? (
          <QuoteView
            quote={selectedQuote}
            onBackClick={() => setSelectedQuote(null)}
            onUpdateStatus={() => {}} // No status update on this page
            onArchive={handleArchive}
            onDelete={(id) => handleDelete([id])}
          />
        ) : (
          <div className="flex bg-secondary text-sm items-center justify-center h-full text-muted-foreground">
            <p>Select an archived quote to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
