import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { formatDistanceToNow } from 'date-fns';

/**
 * Efficiently gets dashboard statistics using database aggregations
 * instead of fetching all records and filtering in memory
 */
export async function getDashboardMetrics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    // Execute all queries in parallel for maximum efficiency
    const [
      totalProducts,
      thisMonthProducts,
      totalQuotes,
      thisMonthQuotes,
      pendingQuotes,
      respondedQuotes,
      totalMessages,
      thisMonthMessages,
      unreadMessages,
    ] = await Promise.all([
      // Products metrics
      prisma.product.count(),
      prisma.product.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // Quotes metrics (exclude archived and trash)
      prisma.quote.count({
        where: { status: { notIn: ['ARCHIVED', 'TRASH'] } },
      }),
      prisma.quote.count({
        where: { 
          status: { notIn: ['ARCHIVED', 'TRASH'] },
          createdAt: { gte: thirtyDaysAgo } 
        },
      }),
      prisma.quote.count({
        where: { status: 'PENDING' },
      }),
      prisma.quote.count({
        where: { status: 'RESPONDED' },
      }),

      // Messages metrics
      prisma.message.count({
        where: { 
          type: 'INBOUND',
          status: { notIn: ['ARCHIVED', 'TRASH'] }
        },
      }),
      prisma.message.count({
        where: {
          type: 'INBOUND',
          status: { notIn: ['ARCHIVED', 'TRASH'] },
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.message.count({
        where: {
          type: 'INBOUND',
          status: 'UNREAD',
        },
      }),
    ]);

    return {
      totalProducts,
      thisMonthProducts,
      totalQuotes,
      thisMonthQuotes,
      pendingQuotes,
      respondedQuotes,
      totalMessages,
      thisMonthMessages,
      unreadMessages,
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    // Return zeros if there's an error
    return {
      totalProducts: 0,
      thisMonthProducts: 0,
      totalQuotes: 0,
      thisMonthQuotes: 0,
      pendingQuotes: 0,
      respondedQuotes: 0,
      totalMessages: 0,
      thisMonthMessages: 0,
      unreadMessages: 0,
    };
  }
}

/**
 * Fetches recent quotes for dashboard display
 */
export async function getRecentQuotes() {
  try {
    const quotes = await prisma.quote.findMany({
      take: 3,
      where: { status: { notIn: ['ARCHIVED', 'TRASH'] } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        company: true,
        productInterest: true,
        createdAt: true,
      },
    });

    return quotes.map((quote) => ({
      id: quote.id,
      name: quote.name,
      company: quote.company || 'N/A',
      product: quote.productInterest || 'General Inquiry',
      date: formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true }),
      avatar: `/images/avatars/avatar-${(quotes.indexOf(quote) % 5) + 1}.png`,
    }));
  } catch (error) {
    console.error('Error fetching recent quotes:', error);
    return [];
  }
}

/**
 * Fetches recent messages for dashboard display
 */
export async function getRecentMessages() {
  try {
    const messages = await prisma.message.findMany({
      take: 2,
      where: { 
        type: 'INBOUND',
        status: { notIn: ['ARCHIVED', 'TRASH'] }
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        subject: true,
        createdAt: true,
      },
    });

    return messages.map((message) => ({
      id: message.id,
      name: message.name || 'Anonymous',
      subject: message.subject || 'No subject',
      date: formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }),
      avatar: `/images/avatars/avatar-${(messages.indexOf(message) % 5) + 1}.png`,
    }));
  } catch (error) {
    console.error('Error fetching recent messages:', error);
    return [];
  }
}

/**
 * Fetches aggregated quote data for chart display
 * Groups quotes by month and product
 */
export async function getQuotesChartData(timeRange: 'daily' | 'weekly' | 'monthly' = 'monthly') {
  try {
    // Determine date range based on time range selection
    const now = new Date();
    let startDate: Date;
    
    if (timeRange === 'daily') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
    } else if (timeRange === 'weekly') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 84); // Last 12 weeks
    } else {
      // For monthly view, show data from start of 2024 to capture all seeded quotes
      startDate = new Date('2024-01-01');
    }

    const quotes = await prisma.quote.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { notIn: ['ARCHIVED', 'TRASH'] },
      },
      select: {
        productInterest: true,
        quantity: true,
        createdAt: true,
      },
    });

    // Get all unique products from DB
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    // Create a map of product names to IDs for matching (case-insensitive)
    const productNameToId = new Map(products.map((p) => [p.name.toLowerCase(), p.id]));
    
    // Track unmatched products for debugging
    const unmatchedProducts = new Set<string>();
    
    // Aggregate by time period and product
    const aggregatedData = new Map<string, any>();
    
    quotes.forEach((quote) => {
      const date = new Date(quote.createdAt);
      let key: string;
      let displayName: string;
      
      if (timeRange === 'daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        displayName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timeRange === 'weekly') {
        // Get week start (Monday)
        const weekStart = new Date(date);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);
        key = weekStart.toISOString().split('T')[0];
        
        // Get week number
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        const weekNum = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
        displayName = `Week ${weekNum} (${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        displayName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      
      const productName = quote.productInterest || 'Other';
      let productId = productNameToId.get(productName.toLowerCase());
      
      // If no exact match found, try fuzzy matching by category keywords
      if (!productId) {
        const lowerName = productName.toLowerCase();
        let matchedProduct;

        if (lowerName.includes('beef')) {
          matchedProduct = products.find(p => p.category === 'Beef' || p.name.toLowerCase().includes('beef'));
        } else if (lowerName.includes('lamb')) {
          matchedProduct = products.find(p => p.category === 'Lamb' || p.name.toLowerCase().includes('lamb'));
        } else if (lowerName.includes('goat')) {
          matchedProduct = products.find(p => p.category === 'Goat' || p.name.toLowerCase().includes('goat'));
        } else if (lowerName.includes('chicken') || lowerName.includes('poultry')) {
          matchedProduct = products.find(p => p.category === 'Poultry' || p.name.toLowerCase().includes('chicken'));
        }

        if (matchedProduct) {
          productId = matchedProduct.id;
        } else {
          if (productName !== 'Other') {
            unmatchedProducts.add(productName);
          }
          productId = 'other';
        }
      }
      
      if (!aggregatedData.has(key)) {
        aggregatedData.set(key, { name: displayName, sortKey: key });
      }
      
      const periodData = aggregatedData.get(key);
      const countKey = `${productId}QuotesCount`;
      const quantityKey = `${productId}TotalQuantity`;
      
      periodData[countKey] = (periodData[countKey] || 0) + 1;
      
      // Parse quantity if it exists
      const quantityMatch = quote.quantity?.match(/(\d+)/);
      const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 0;
      periodData[quantityKey] = (periodData[quantityKey] || 0) + quantity;
    });

    // Log unmatched products for debugging
    if (unmatchedProducts.size > 0) {
      logger.debug('[QuotesChart] Unmatched products mapped to Other', { 
        unmatchedProducts: Array.from(unmatchedProducts) 
      });
    }

    // Sort by date and remove sortKey
    const chartData = Array.from(aggregatedData.values())
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ sortKey, ...rest }) => rest); // sortKey used for sorting above, removed here

    // Always include 'Other' in products list for unmatched items
    const allProducts = [
      ...products.map(p => ({ id: p.id, name: p.name })),
      { id: 'other', name: 'Other' }
    ];

    return {
      chartData,
      products: allProducts,
    };
  } catch (error) {
    console.error('Error fetching quotes chart data:', error);
    return { chartData: [], products: [] };
  }
}
