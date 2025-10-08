
import { ProductsPageClient } from '@/components/products/ProductsPageClient';
import { getProducts } from '@/lib/data-access';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
}

async function getProductsData(): Promise<Product[]> {
    return getProducts();
}

export default async function ProductsPage() {
  const products = await getProductsData();
  return <ProductsPageClient products={products} />;
}
