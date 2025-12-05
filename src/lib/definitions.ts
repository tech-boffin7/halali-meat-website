import { Message } from '@/components/messages/types';
import { Quote } from '@/components/quotes/types';
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export const quoteSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  productInterest: z.string().min(1, { message: 'Product interest is required' }),
  quantity: z.string().min(1, { message: 'Quantity is required' }),
  message: z.string().optional(),
});

export const ProductTypeEnum = z.enum(['CHILLED', 'FROZEN']);

export const productSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  description: z.string().min(1, { message: 'Product description is required' }),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  category: z.string().min(1, { message: 'Category is required' }),
  type: ProductTypeEnum,
  imageUrl: z.string().url({ message: 'Invalid image URL' }),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }).optional(),
  description: z.string().min(1, { message: 'Product description is required' }).optional(),
  price: z.number().positive({ message: 'Price must be a positive number' }).optional(),
  category: z.string().min(1, { message: 'Category is required' }).optional(),
  type: ProductTypeEnum.optional(),
  imageUrl: z.string().url({ message: 'Invalid image URL' }).optional(),
});

export const composeMessageSchema = z.object({
  to: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  body: z.string().min(1, { message: 'Message body is required' }),
});

export type MessageCounts = {
  total: number;
  totalInbound: number;
  unread: number;
  read: number;
  archived: number;
  trash: number;
  sent: number;
};

export type QuoteCounts = {
    total: number;
    unread: number;
    read: number;
    pending: number;
    processed: number;
    responded: number;
    archived: number;
    trash: number;
};

export type ActionResponse = {
  success: boolean;
  messages?: Message[];
  quotes?: Quote[];
  totalCount?: number;
  message?: string;
  counts?: MessageCounts | QuoteCounts;
  errors?: Record<string, string[]>;
};