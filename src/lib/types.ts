export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string | null;
}

export interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  status: string;
  createdAt: Date;
}
