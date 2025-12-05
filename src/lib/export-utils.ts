import { Quote } from '@/components/quotes/types';

export function generateCSVContent(quotes: Quote[]): string {
  if (quotes.length === 0) {
    return '';
  }

  // Define CSV headers
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Company',
    'Product Interest',
    'Quantity',
    'Message',
    'Status',
    'Created At'
  ];

  // Convert quotes to CSV rows
  const rows = quotes.map(quote => [
    quote.name,
    quote.email,
    quote.phone,
    quote.company || '',
    quote.productInterest || '',
    quote.quantity || '',
    quote.message,
    quote.status,
    new Date(quote.createdAt).toLocaleString()
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
          ? `"${cell.replace(/"/g, '""')}"`
          : cell
      ).join(',')
    )
  ].join('\n');

  return csvContent;
}

export function exportQuotesToCSV(quotes: Quote[]) {
  const csvContent = generateCSVContent(quotes);
  if (!csvContent) return;

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `quotes-export-${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import { Message } from '@/components/messages/types';
import { Product } from '@/components/products/types';

export function generateMessagesCSVContent(messages: Message[]): string {
  if (messages.length === 0) {
    return '';
  }

  // Define CSV headers
  const headers = [
    'Name',
    'Email',
    'Subject',
    'Body',
    'Type',
    'Status',
    'Created At'
  ];

  // Convert messages to CSV rows
  const rows = messages.map(message => [
    message.name,
    message.email,
    message.subject,
    message.body,
    message.type,
    message.status,
    new Date(message.createdAt).toLocaleString()
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
          ? `"${cell.replace(/"/g, '""')}"`
          : cell
      ).join(',')
    )
  ].join('\n');

  return csvContent;
}

export function exportMessagesToCSV(messages: Message[]) {
  const csvContent = generateMessagesCSVContent(messages);
  if (!csvContent) return;

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `messages-export-${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateProductsCSVContent(products: Product[]): string {
  if (products.length === 0) {
    return '';
  }

  // Define CSV headers
  const headers = [
    'Name',
    'Category',
    'Type',
    'Description',
    'Price',
    'Image URL'
  ];

  // Convert products to CSV rows
  const rows = products.map(product => [
    product.name,
    product.category,
    product.type,
    product.description,

    product.price?.toString() || '',
    product.imageUrl
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
          ? `"${cell.replace(/"/g, '""')}"`
          : cell
      ).join(',')
    )
  ].join('\n');

  return csvContent;
}

export function exportProductsToCSV(products: Product[]) {
  const csvContent = generateProductsCSVContent(products);
  if (!csvContent) return;

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `products-export-${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
