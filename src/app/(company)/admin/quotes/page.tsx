
import { QuotesClient } from '@/components/quotes/QuotesClient';
import { getQuotes } from '@/lib/data-access';

async function getQuotesData() {
    return getQuotes();
}

export default async function AdminQuotesPage() {
  const quotes = await getQuotesData();

  return <QuotesClient initialQuotes={quotes} />;
}
