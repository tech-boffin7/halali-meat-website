import { QuoteStatus } from '@prisma/client';

export interface Reply {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
}

export interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  productInterest: string | null;
  quantity: string | null;
  message: string | null;
  status: QuoteStatus;
  createdAt: Date;
  replies: Reply[];
  [key: string]: any;
}