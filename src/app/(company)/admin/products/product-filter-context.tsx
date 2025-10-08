'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/components/products/types';

interface ProductFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  clearFilters: () => void;
  allProducts: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

export function useProductFilters() {
  const context = useContext(ProductFilterContext);
  if (!context) {
    throw new Error('useProductFilters must be used within a ProductFilterProvider');
  }
  return context;
}

export function ProductFilterProvider({ 
  children, 
  initialProducts, 
  onAddProduct, 
  onEditProduct,
  onDeleteProduct
}: { 
  children: ReactNode, 
  initialProducts: Product[],
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTypes([]);
  };

  return (
    <ProductFilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategories,
        toggleCategory,
        selectedTypes,
        toggleType,
        clearFilters,
        allProducts: initialProducts,
        onAddProduct,
        onEditProduct,
        onDeleteProduct,
      }}
    >
      {children}
    </ProductFilterContext.Provider>
  );
}