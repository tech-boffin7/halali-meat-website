'use client';

import { useEffect, useState } from 'react';

interface BadgeCounts {
  quotes: number;
  messages: number;
}

export function useBadgeCounts() {
  const [counts, setCounts] = useState<BadgeCounts>({ quotes: 0, messages: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      const [quotesRes, messagesRes] = await Promise.all([
        fetch('/api/quotes/count'),
        fetch('/api/messages/unread'),
      ]);

      const quotesData = await quotesRes.json();
      const messagesData = await messagesRes.json();

      setCounts({
        quotes: quotesData.count || 0,
        messages: messagesData.count || 0,
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching badge counts:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCounts();

    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetchCounts, 30000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return { counts, isLoading };
}
