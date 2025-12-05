'use client';

import { QuotesClient } from '@/components/quotes/QuotesClient';
import { useQuotes } from '@/app/(company)/admin/quotes/quotes-context';
import { useEffect } from 'react';

export default function RespondedQuotesPage() {
  const { setStatusFilter } = useQuotes();

  useEffect(() => {
    setStatusFilter('RESPONDED');
  }, [setStatusFilter]);

  return <QuotesClient />;
}
