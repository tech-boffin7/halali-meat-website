'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ProductItem } from './ProductItem';
import { Product } from './types';

interface ProductListProps {
    products: Product[];
    selectedProduct: Product | null;
    onSelectProduct: (product: Product) => void;
    onAddProduct: () => void;
}

export function ProductList({ products, selectedProduct, onSelectProduct, onAddProduct }: ProductListProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p className="mb-4">No products found.</p>
                <Button onClick={onAddProduct} size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-card border">
            <div className="flex-1 overflow-y-auto">
                <ul className="divide-y divide-border border-b">
                    {products.map((product) => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            isSelected={selectedProduct?.id === product.id}
                            onSelect={onSelectProduct}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}