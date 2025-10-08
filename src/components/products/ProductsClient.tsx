'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ProductList } from './ProductList';
import { ProductView } from './ProductView';
import { useProductFilters } from '@/app/(company)/admin/products/product-filter-context';

export function ProductsClient() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { allProducts, searchQuery, selectedCategories, selectedTypes, onAddProduct, onEditProduct, onDeleteProduct } = useProductFilters();

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            const searchMatch = searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
            const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(p.category.toLowerCase()) : true;
            const typeMatch = selectedTypes.length > 0 ? selectedTypes.includes(p.type.toLowerCase()) : true;
            return searchMatch && categoryMatch && typeMatch;
        });
    }, [allProducts, searchQuery, selectedCategories, selectedTypes]);

    const handleDelete = (id: string) => {
        onDeleteProduct(id);
        setSelectedProduct(null);
    }

    return (
        <div className={cn('grid h-full gap-4', selectedProduct ? 'md:grid-cols-[minmax(300px,_1fr)_2fr]' : 'md:grid-cols-1')}>
            <div className={cn('h-full', selectedProduct && 'hidden md:block')}>
                <ProductList
                    products={filteredProducts}
                    selectedProduct={selectedProduct}
                    onSelectProduct={setSelectedProduct}
                    onAddProduct={onAddProduct}
                />
            </div>
            <div className={cn('h-full', !selectedProduct && 'hidden md:block')}>
                {selectedProduct ? (
                    <ProductView
                        product={selectedProduct}
                        onEdit={() => onEditProduct(selectedProduct)}
                        onDelete={() => handleDelete(selectedProduct.id)}
                        onBack={() => setSelectedProduct(null)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary text-sm rounded-lg">
                        <p>Select a product to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}