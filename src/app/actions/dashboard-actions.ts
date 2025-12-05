'use server';

import { getQuotesChartData } from '@/lib/dashboard-service';

/**
 * Server Action to fetch quotes chart data dynamically
 * Allows client-side time range switching without full page reload
 */
export async function fetchQuotesChartData(
  timeRange: 'daily' | 'weekly' | 'monthly' = 'monthly'
) {
  try {
    return await getQuotesChartData(timeRange);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return { chartData: [], products: [] };
  }
}
