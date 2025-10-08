'use client';

import { useState } from 'react';
import { QuotesShell } from '@/components/quotes/QuotesShell';
import { SearchProvider } from '@/app/(company)/admin/messages/search-context'; // Reusing search context for now
import { QuoteFilterProvider } from './quote-filter-context';

export default function QuotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SearchProvider searchQuery={searchQuery} handleSearch={handleSearch}>
      <QuoteFilterProvider>
        <QuotesShell searchQuery={searchQuery} onSearch={handleSearch}>
          {children}
        </QuotesShell>
      </QuoteFilterProvider>
    </SearchProvider>
  );
}
