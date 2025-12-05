'use client';

import { QuotesClient } from '@/components/quotes/QuotesClient';
import { useQuotes } from '@/app/(company)/admin/quotes/quotes-context';
import { useEffect } from 'react';

export default function PendingQuotesPage() {
  const { setStatusFilter } = useQuotes();

  useEffect(() => {
    setStatusFilter('PENDING');
  }, [setStatusFilter]);

  return <QuotesClient />;
}
