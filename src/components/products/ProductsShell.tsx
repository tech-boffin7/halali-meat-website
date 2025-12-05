'use client';

import { useState } from 'react';
import { ProductsSidebar } from './ProductsSidebar';
import { Product } from './types';

interface ProductsShellProps {
  children: React.ReactNode;
  products: Product[];
  onDeleteProduct?: (product: Product) => void;
}

export function ProductsShell({ children, onDeleteProduct }: ProductsShellProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Helper to inject props into children if they are valid elements
  // This is still needed if we want to keep the API clean, but we can make it safer
  // Alternatively, we could use a context, but for this specific shell pattern, 
  // we might want to just expose the state via render props or context in a future refactor.
  // For now, let's keep the prop injection but make it cleaner or consider if we can avoid it.
  
  // Actually, the best way to avoid cloneElement here while keeping the layout responsibility
  // is to use a Context for the Shell state, OR just accept that this Shell is a layout wrapper
  // and the children should handle their own state via the global ProductFilterContext.
  // BUT, selectedProduct is local UI state for the master-detail view.
  
  // Let's use a small local context for the Shell state to avoid cloneElement
  
  return (
    <ProductsShellContext.Provider value={{ selectedProduct, setSelectedProduct, onDeleteProduct }}>
      {/* Desktop: Sidebar + Detail Layout */}
      <div className="hidden md:grid md:min-h-screen md:w-full md:grid-cols-[320px_1fr] overflow-x-hidden">
        <ProductsSidebar 
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
        />
        <main className="flex flex-1 flex-col p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile: Stack Navigation (List OR Detail) */}
      <div className="md:hidden min-h-screen w-full flex flex-col overflow-x-hidden">
        {selectedProduct ? (
          /* Detail View - Full Screen */
          <main className="flex-1 flex flex-col overflow-x-hidden">
             {children}
          </main>
        ) : (
          /* List View - Full Screen */
          <ProductsSidebar 
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            isMobile={true}
          />
        )}
      </div>
    </ProductsShellContext.Provider>
  );
}

// Create the context
import { createContext, useContext } from 'react';

interface ProductsShellContextType {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  onDeleteProduct?: (product: Product) => void;
}

export const ProductsShellContext = createContext<ProductsShellContextType | undefined>(undefined);

export function useProductsShell() {
  const context = useContext(ProductsShellContext);
  if (!context) {
    throw new Error('useProductsShell must be used within a ProductsShell');
  }
  return context;
}
