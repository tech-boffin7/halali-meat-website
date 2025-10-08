import { ArchivedQuotesClient } from '@/components/quotes/ArchivedQuotesClient';
import { getQuotes } from '@/lib/data-access';

async function getArchivedQuotes() {
    const allQuotes = await getQuotes();
    // In a real app, you would fetch only archived quotes from the API
    return allQuotes.filter((q: any) => q.isArchived);
}

export default async function AdminArchivedQuotesPage() {
  const quotes = await getArchivedQuotes();

  return <ArchivedQuotesClient initialQuotes={quotes} />;
}