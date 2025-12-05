import { QuoteStatus } from '@prisma/client';
import { Quote } from '../src/components/quotes/types';
import { generateCSVContent } from '../src/lib/export-utils';

const mockQuotes: Quote[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    company: 'Acme Corp',
    productInterest: 'Ribeye',
    quantity: '10kg',
    message: 'Hello, world',
    status: QuoteStatus.PENDING,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date(),
    replies: []
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '0987654321',
    company: null,
    productInterest: null,
    quantity: null,
    message: 'Message with "quotes" and, commas',
    status: QuoteStatus.PROCESSED,
    createdAt: new Date('2023-01-02T00:00:00Z'),
    updatedAt: new Date(),
    replies: []
  }
];

console.log('Running CSV Export Test...');

const csv = generateCSVContent(mockQuotes);

console.log('Generated CSV:');
console.log(csv);

// Basic Assertions
if (!csv.includes('Name,Email,Phone')) {
  console.error('FAIL: Missing headers');
  process.exit(1);
}

if (!csv.includes('John Doe,john@example.com')) {
  console.error('FAIL: Missing John Doe data');
  process.exit(1);
}

if (!csv.includes('"Message with ""quotes"" and, commas"')) {
  console.error('FAIL: Incorrect escaping of special characters');
  process.exit(1);
}

console.log('SUCCESS: All checks passed!');
