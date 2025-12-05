'use client';

import { createProduct, deleteProduct, updateProduct } from '@/app/actions/product-actions';
import { AddProductDialog } from '@/components/products/AddProductDialog';
import { ProductsClient } from '@/components/products/ProductsClient';
import { ProductsErrorBoundary } from '@/components/products/ProductsErrorBoundary';
import { ProductsShell } from '@/components/products/ProductsShell';
import { Product } from '@/components/products/types';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProductFilterProvider, useProductFilters } from './product-filter-context';

/**
 * ProductsPageContent - Main content component
 * Renders the products interface with export button
 */
function ProductsPageContent() {
    const { products, setProducts } = useProductFilters();
    // const [isExportLoading, setIsExportLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const router = useRouter();

    /**
     * Export products to CSV with current filters applied
     */
    // const handleExport = async () => {
    //     setIsExportLoading(true);
    //     try {
    //         const categoryFilter = selectedCategories.length > 0 ? selectedCategories[0] : undefined;
    //         const typeFilter = selectedTypes.length > 0 ? selectedTypes[0] : undefined;
    //         
    //         const result = await getAllProductsForExport(
    //             searchQuery, 
    //             sortBy, 
    //             undefined, // dateFrom - not used
    //             undefined, // dateTo - not used
    //             categoryFilter,
    //             typeFilter
    //         );
    //         
    //         if (result.success && result.products) {
    //             exportProductsToCSV(result.products as Product[]);
    //             toast.success(`Exported ${result.products.length} products to CSV`);
    //         } else {
    //             toast.error('Failed to export products');
    //         }
    //     } catch (error) {
    //         console.error('Export failed:', error);
    //         toast.error('Failed to export products');
    //     } finally {
    //         setIsExportLoading(false);
    //     }
    // };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        
        const product = productToDelete;
        
        // 1. Optimistic UI Update
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
        
        const previousProducts = [...products];
        setProducts(prev => prev.filter(p => p.id !== product.id));
        toast.success('Product deleted'); // Immediate feedback

        try {
            // 2. Server Action
            const result = await deleteProduct(product.id);
            
            if (!result.success) {
                // Revert if failed
                setProducts(previousProducts);
                toast.error(result.message);
            } else {
                // Sync server state silently
                router.refresh();
            }
        } catch (error: any) {
            // Revert on error
            setProducts(previousProducts);
            toast.error(error.message || 'Error deleting product');
        }
    };

    return (
        <>
            <ProductsShell 
                products={products} 
                onDeleteProduct={handleDeleteClick}
            >
                <ProductsClient />
            </ProductsShell>

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description={`Are you sure you want to delete "${productToDelete?.name || ''}"? This action cannot be undone.`}
                confirmButtonText="Delete"
            />
        </>
    );
}

/**
 * ProductsPageRoot - Root component with state management
 * Manages all CRUD operations and dialogs at the root level
 * so handlers can be properly passed to ProductFilterProvider
 */
export function ProductsPageRoot({ initialProducts }: { initialProducts: Product[] }) {
    const router = useRouter();
    
    // Dialog state management
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    /**
     * Open dialog to add new product
     */
    const handleAddProduct = () => {
        setProductToEdit(null);
        setIsAddDialogOpen(true);
    };

    /**
     * Open dialog to edit existing product
     */
    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setIsAddDialogOpen(true);
    };

    /**
     * Open confirmation dialog for product deletion
     */
    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    /**
     * Confirm and execute product deletion
     */
    /**
     * Confirm and execute product deletion
     */
    const confirmDelete = async () => {
        if (!productToDelete) return;
        
        // Optimistically close dialog
        setIsDeleteDialogOpen(false);
        const product = productToDelete;
        setProductToDelete(null);

        try {
            // Optimistic update handled by context if needed, but for now we rely on fast server action
            // For true optimistic update we'd need to expose setProducts from context
            
            const result = await deleteProduct(product.id);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
                // If failed, we might need to revert (complex without global state store)
            }
        } catch (error: any) {
            toast.error(error.message || 'Error deleting product');
        }
    };

    /**
     * Save product (create or update)
     */
    const handleSaveProduct = async (formData: FormData) => {
        try {
            const result = productToEdit 
                ? await updateProduct(productToEdit.id, formData)
                : await createProduct(formData);

            if (result.success) {
                toast.success(result.message);
                setIsAddDialogOpen(false);
                router.refresh();
                // Force immediate re-fetch to show updated product
                setTimeout(() => {
                    router.refresh();
                }, 100);
            } else {
                // Handle validation errors
                // Cast to any to safely check properties on the union type
                const errorResult = result as any;
                if (errorResult.errors) {
                    Object.values(errorResult.errors as Record<string, string[]>).forEach((errorArray: string[]) => {
                        errorArray?.forEach((error: string) => toast.error(error));
                    });
                } else if (errorResult.message) {
                    toast.error(errorResult.message);
                } else {
                    toast.error('An unknown error occurred');
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Error saving product');
        }
    };

    return (
        <ProductsErrorBoundary>
            <ProductFilterProvider 
                initialProducts={initialProducts}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
            >
                <ProductsPageContent />
            </ProductFilterProvider>

            {/* Add/Edit product dialog */}
            <AddProductDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />

            {/* Delete confirmation dialog */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description={`Are you sure you want to delete "${productToDelete?.name || ''}"? This action cannot be undone.`}
                confirmButtonText="Delete"
            />
        </ProductsErrorBoundary>
    );
}
