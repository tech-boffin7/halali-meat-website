import { format, startOfWeek, addDays, getWeek } from 'date-fns';
import { products } from './products'; // Import products to get IDs
import mockQuotes from './mock-quotes.json'; // Import mock quotes

// Helper to get product IDs and map product names to IDs
const productMap = new Map(products.map(p => [p.name, p.id]));
const productIds = products.map(p => p.id);

// Function to parse quantity from string (e.g., "500 kg" -> 500)
const parseQuantity = (quantityStr: string): number => {
  const match = quantityStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Generate raw daily quote data from mock quotes
interface RawQuoteEntry {
  date: string;
  productId: string;
  quantity: number;
}

const generateRawQuoteData = (): RawQuoteEntry[] => {
  const data: RawQuoteEntry[] = [];
  (mockQuotes as any[]).forEach(quote => {
    const productId = productMap.get(quote.productInterest);
    if (productId) {
      data.push({
        date: format(new Date(quote.timestamp), 'yyyy-MM-dd'),
        productId,
        quantity: parseQuantity(quote.quantity),
      });
    }
  });

  // Add some more recent mock data to make the graph more dynamic
  const today = new Date();
  for (let i = 0; i < 30; i++) { // Add data for the last 30 days
    const currentDay = addDays(today, -i);
    const numQuotes = Math.floor(Math.random() * 5); // 0-4 quotes per day
    for (let j = 0; j < numQuotes; j++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      data.push({
        date: format(currentDay, 'yyyy-MM-dd'),
        productId: randomProduct.id,
        quantity: Math.floor(Math.random() * 500) + 50, // 50-550 units
      });
    }
  }
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const rawDailyQuoteData = generateRawQuoteData();

interface AggregatedEntry {
  name: string;
  [key: string]: string | number; // Allow string for 'name' and number for other dynamic properties
}

const aggregateQuoteData = (data: RawQuoteEntry[], granularity: 'month' | 'week' | 'day') => {
  const aggregatedMap = new Map<string, any>();

  data.forEach(item => {
    const date = new Date(item.date);
    let key: string;
    let name: string;

    if (granularity === 'month') {
      key = format(date, 'yyyy-MM');
      name = format(date, 'MMM yyyy');
    } else if (granularity === 'week') {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      key = format(weekStart, 'yyyy-MM-dd');
      name = `Week ${getWeek(date, { weekStartsOn: 1 })} (${format(weekStart, 'MMM dd')})`;
    } else {
      key = format(date, 'yyyy-MM-dd');
      name = format(date, 'MMM dd');
    }

    if (!aggregatedMap.has(key)) {
      const newEntry: AggregatedEntry = { name };
      productIds.forEach(productId => {
        newEntry[`${productId}QuotesCount`] = 0;
        newEntry[`${productId}TotalQuantity`] = 0;
      });
      aggregatedMap.set(key, newEntry);
    }

    const currentEntry = aggregatedMap.get(key);
    currentEntry[`${item.productId}QuotesCount`]++;
    currentEntry[`${item.productId}TotalQuantity`] += item.quantity;
  });

  return Array.from(aggregatedMap.values());
};

export const getMonthlyQuotesData = () => aggregateQuoteData(rawDailyQuoteData, 'month');
export const getWeeklyQuotesData = () => aggregateQuoteData(rawDailyQuoteData, 'week');
export const getDailyQuotesData = () => aggregateQuoteData(rawDailyQuoteData, 'day');

export const recentQuotes = [
  {
    id: 'quote-1',
    name: 'Ahmed Al-Jaber',
    company: 'GCC Imports',
    product: 'Beef Brisket',
    date: '2 hours ago',
    avatar: '/images/avatars/avatar-1.png',
  },
  {
    id: 'quote-2',
    name: 'Fatima Al-Fahim',
    company: 'Dubai Fine Foods',
    product: 'Lamb Leg',
    date: '1 day ago',
    avatar: '/images/avatars/avatar-2.png',
  },
  {
    id: 'quote-3',
    name: 'Yusuf Al-Humaid',
    company: 'Riyadh Meats',
    product: 'Goat Shoulder',
    date: '3 days ago',
    avatar: '/images/avatars/avatar-3.png',
  },
];

export const recentMessages = [
  {
    id: 'msg-1',
    name: 'Mohammed Khan',
    subject: 'Inquiry about shipping',
    date: '5 hours ago',
    avatar: '/images/avatars/avatar-4.png',
  },
  {
    id: 'msg-2',
    name: 'Aisha Al-Nuaimi',
    subject: 'Question about Halal certification',
    date: '2 days ago',
    avatar: '/images/avatars/avatar-5.png',
  },
];