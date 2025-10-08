import { ProductsSidebar } from './ProductsSidebar';
import { ProductsNavbar } from './ProductsNavbar';
import { Product } from './types';

interface ProductsShellProps {
  children: React.ReactNode;
  products: Product[];
}

export function ProductsShell({ children, products }: ProductsShellProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-x-auto scrollbar-thin">
      <ProductsSidebar />
      <div className="flex flex-col px-2">
        <header className="flex h-14 items-center gap-4 px-4 sm:px-6">
          <ProductsNavbar products={products} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 border-t lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
