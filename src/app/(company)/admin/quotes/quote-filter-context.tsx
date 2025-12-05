'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type QuoteStatusFilter = 'ALL' | 'PENDING' | 'RESPONDED' | 'PROCESSED' | 'ARCHIVED';

interface QuoteFilterContextType {
  statusFilter: QuoteStatusFilter;
  setStatusFilter: (filter: QuoteStatusFilter) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const QuoteFilterContext = createContext<QuoteFilterContextType | undefined>(undefined);

export function useQuoteFilter() {
  const context = useContext(QuoteFilterContext);
  if (context === undefined) {
    throw new Error('useQuoteFilter must be used within a QuoteFilterProvider');
  }
  return context;
}

export function QuoteFilterProvider({ children, initialStatusFilter }: { children: ReactNode, initialStatusFilter?: QuoteStatusFilter }) {
  const [statusFilter, setStatusFilter] = useState<QuoteStatusFilter>(initialStatusFilter || 'ALL');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  return (
    <QuoteFilterContext.Provider value={{ statusFilter, setStatusFilter, sortBy, setSortBy }}>
      {children}
    </QuoteFilterContext.Provider>
  );
}