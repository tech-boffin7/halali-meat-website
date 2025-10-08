import { Product } from '@/components/products/types';
import { getProducts } from '@/lib/data-access';
import { ProductsPageRoot } from './ProductsPageRoot';

async function getProductsData(): Promise<Product[]> {
    return getProducts();
}

export default async function ProductsPage() {
  const products = await getProductsData();
  return <ProductsPageRoot initialProducts={products} />;
}