'use client';

import { QuotesClient } from '@/components/quotes/QuotesClient';
import { useQuotes } from '@/app/(company)/admin/quotes/quotes-context';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { emptyTrash } from '@/app/actions/quote-actions';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

export default function TrashQuotesPage() {
  const { setStatusFilter, quotes, setQuotes } = useQuotes();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    setStatusFilter('TRASH');
  }, [setStatusFilter]);

  const handleEmptyTrash = async () => {
    const result = await emptyTrash();
    if (result.success) {
      toast.success(result.message);
      setQuotes([]);
    } else {
      toast.error(result.message);
    }
    setIsConfirmOpen(false);
  };

  return (
    <>
      {quotes.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
            Empty Trash
          </Button>
        </div>
      )}
      <QuotesClient />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleEmptyTrash}
        title="Are you sure?"
        description="This will permanently delete all quotes in the trash. This action cannot be undone."
      />
    </>
  );
}
