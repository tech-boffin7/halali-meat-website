import { QuotesClient } from '@/components/quotes/QuotesClient';
import { QuotesErrorBoundary } from '@/components/quotes/QuotesErrorBoundary';

export default function AdminQuotesPage() {
  return (
    <QuotesErrorBoundary>
      <QuotesClient />
    </QuotesErrorBoundary>
  );
}