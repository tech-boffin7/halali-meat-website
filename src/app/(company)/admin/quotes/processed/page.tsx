'use client';

import { QuotesClient } from '@/components/quotes/QuotesClient';
import { useQuotes } from '@/app/(company)/admin/quotes/quotes-context';
import { useEffect } from 'react';

export default function ProcessedQuotesPage() {
  const { setStatusFilter } = useQuotes();

  useEffect(() => {
    setStatusFilter('PROCESSED');
  }, [setStatusFilter]);

  return <QuotesClient />;
}
