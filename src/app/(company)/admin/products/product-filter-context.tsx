'use client';

import { getProductsAction } from '@/app/actions/product-actions';
import { Product } from '@/components/products/types';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

interface ProductFilterContextType {
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  clearFilters: () => void;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  loadMore: () => void;
  hasMore: boolean;
  refreshProducts: () => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

export function useProductFilters() {
  const context = useContext(ProductFilterContext);
  if (!context) {
    throw new Error('useProductFilters must be used within a ProductFilterProvider');
  }
  return context;
}

const PRODUCTS_PER_PAGE = 12;

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
  onDeleteProduct: (product: Product) => void;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt_desc');

  const fetchProducts = useCallback(async (pageNum: number, shouldRefresh: boolean) => {
    setIsLoading(true);
    try {
      const categoryFilter = selectedCategories.length > 0 ? selectedCategories[0] : undefined;
      const typeFilter = selectedTypes.length > 0 ? selectedTypes[0] : undefined;

      const response = await getProductsAction(
        pageNum, 
        PRODUCTS_PER_PAGE, 
        debouncedSearchQuery, 
        sortBy, 
        undefined,
        undefined,
        categoryFilter,
        typeFilter
      );

      if (response.success && response.products) {
        setProducts(prev => {
          if (shouldRefresh) {
            return response.products || [];
          }
          const newProducts = (response.products || []).filter(
            (p: Product) => !prev.some(prevP => prevP.id === p.id)
          );
          return [...prev, ...newProducts];
        });
        setHasMore((response.products?.length || 0) === PRODUCTS_PER_PAGE);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, sortBy, selectedCategories, selectedTypes]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [debouncedSearchQuery, sortBy, selectedCategories, selectedTypes, fetchProducts]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, false);
    }
  };

  const refreshProducts = () => {
    setPage(1);
    fetchProducts(1, true);
  };

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
    setSortBy('createdAt_desc');
  };

  // Wrap user handlers to trigger refresh
  const handleAddProduct = () => {
    onAddProduct();
  };

  const handleEditProduct = (product: Product) => {
    onEditProduct(product);
  };

  const handleDeleteProduct = (product: Product) => {
    onDeleteProduct(product);
    // Refresh to remove deleted product
    setTimeout(() => refreshProducts(), 500);
  };

  return (
    <ProductFilterContext.Provider
      value={{
        products,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedCategories,
        toggleCategory,
        selectedTypes,
        toggleType,
        sortBy,
        setSortBy,
        clearFilters,
        onAddProduct: handleAddProduct,
        onEditProduct: handleEditProduct,
        onDeleteProduct: handleDeleteProduct,
        loadMore,
        hasMore,
        refreshProducts,
        setProducts
      }}
    >
      {children}
    </ProductFilterContext.Provider>
  );
}