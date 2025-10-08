'use client';

import { cn } from '@/lib/utils';
import { Product } from './types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';

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
                        <li
                            key={product.id}
                            onClick={() => onSelectProduct(product)}
                            className={cn(
                                'p-4 cursor-pointer hover:bg-muted/50',
                                selectedProduct?.id === product.id && 'bg-muted'
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <Image
                                    src={product.image || '/images/placeholder.jpg'}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover h-10 w-10"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.category} - {product.type}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}