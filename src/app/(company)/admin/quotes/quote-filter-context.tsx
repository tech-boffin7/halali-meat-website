'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type QuoteStatusFilter = 'all' | 'pending' | 'processed' | 'archived';

interface QuoteFilterContextType {
  statusFilter: QuoteStatusFilter;
  setStatusFilter: (filter: QuoteStatusFilter) => void;
}

const QuoteFilterContext = createContext<QuoteFilterContextType | undefined>(undefined);

export function useQuoteFilter() {
  const context = useContext(QuoteFilterContext);
  if (context === undefined) {
    throw new Error('useQuoteFilter must be used within a QuoteFilterProvider');
  }
  return context;
}

export function QuoteFilterProvider({ children }: { children: ReactNode }) {
  const [statusFilter, setStatusFilter] = useState<QuoteStatusFilter>('all');

  return (
    <QuoteFilterContext.Provider value={{ statusFilter, setStatusFilter }}>
      {children}
    </QuoteFilterContext.Provider>
  );
}
