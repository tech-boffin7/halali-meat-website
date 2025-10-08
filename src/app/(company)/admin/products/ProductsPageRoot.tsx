'use client';

import { useState } from 'react';
import { ProductFilterProvider } from './product-filter-context';
import { ProductsShell } from '@/components/products/ProductsShell';
import { ProductsClient } from '@/components/products/ProductsClient';
import { AddProductDialog } from '@/components/products/AddProductDialog';
import { Product } from '@/components/products/types';
import { toast } from 'sonner';

export function ProductsPageRoot({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const handleAddProduct = () => {
        setProductToEdit(null);
        setIsDialogOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setIsDialogOpen(true);
    };

    const handleDeleteProduct = (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted successfully');
    };

    const handleSaveProduct = (product: Product) => {
        if (productToEdit) {
            setProducts(products.map(p => p.id === product.id ? product : p));
            toast.success('Product updated successfully');
        } else {
            const newProduct = { ...product, id: Date.now().toString() };
            setProducts([newProduct, ...products]);
            toast.success('Product added successfully');
        }
        setIsDialogOpen(false);
    };

    return (
        <ProductFilterProvider 
            initialProducts={products} 
            onAddProduct={handleAddProduct} 
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
        >
            <ProductsShell products={products}>
                <ProductsClient />
            </ProductsShell>
            <AddProductDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />
        </ProductFilterProvider>
    );
}
