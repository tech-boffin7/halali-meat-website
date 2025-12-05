
import { ProductsPageClient } from '@/components/products/ProductsPageClient';
import { getProducts } from '@/lib/data-access';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
  category: string;
  createdAt: Date;
}

// Enable ISR with 60-second revalidation
export const revalidate = 60;

async function getProductsData(): Promise<Product[]> {
    const { products } = await getProducts(1, 100); // Fetch initial batch
    return products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      image: p.imageUrl || '',
      type: p.type || 'FROZEN',
      category: p.category || '',
      createdAt: p.createdAt,
    }));
}

export default async function ProductsPage() {
  const products = await getProductsData();
  return <ProductsPageClient products={products} />;
}
