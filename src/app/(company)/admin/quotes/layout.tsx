'use client';

import { QuotesShell } from '@/components/quotes/QuotesShell';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { QuotesProvider } from './quotes-context';

export default function QuotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <QuotesProvider>
        <QuotesShell>
          {children}
        </QuotesShell>
      </QuotesProvider>
    </ErrorBoundary>
  );
}