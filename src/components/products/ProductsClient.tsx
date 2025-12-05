'use client';

import { useProductFilters } from '@/app/(company)/admin/products/product-filter-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package2 } from 'lucide-react';
import { ProductView } from './ProductView';
import { Product } from './types';

interface ProductsClientProps {
    selectedProduct?: Product | null;
    onBack?: () => void;
    isMobile?: boolean;
    onDeleteProduct?: (product: Product) => void;
}

import { useContext } from 'react';
import { ProductsShellContext } from './ProductsShell';

// ...

export function ProductsClient({ 
    selectedProduct: propSelectedProduct = null, 
    onBack: propOnBack = () => {},
    isMobile = false,
    onDeleteProduct: propOnDeleteProduct 
}: ProductsClientProps) {
    const { onEditProduct, onDeleteProduct: contextDeleteProduct } = useProductFilters();
    
    // Safe context usage without try-catch to satisfy hook rules
    const shellContext = useContext(ProductsShellContext);

    const selectedProduct = shellContext?.selectedProduct ?? propSelectedProduct;
    const onBack = shellContext ? () => shellContext.setSelectedProduct(null) : propOnBack;
    const onDeleteProduct = shellContext?.onDeleteProduct ?? propOnDeleteProduct;

    // Use passed handler if available (for optimistic updates), otherwise fallback to context
    const handleDelete = onDeleteProduct || contextDeleteProduct;

    if (!selectedProduct) {
        return (
            <div className="flex flex-col items-center justify-center sticky top-80 h-100vh text-muted-foreground p-8 text-center !bg-muted/40">
                <div className="bg-muted/50 p-4 rounded-full mb-4">
                    <Package2 className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Product Selected</h3>
                <p className="text-sm max-w-sm mx-auto">
                    Select a product from the list to view details, manage inventory, or edit information.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Mobile Header with Back Button */}
            {isMobile && selectedProduct && (
                <div className="flex items-center gap-2 p-3 border-b bg-muted/40 shrink-0">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onBack}
                        className="h-8 w-8"
                        data-tooltip="Back to list"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="font-semibold text-sm truncate flex-1">
                        {selectedProduct.name}
                    </h1>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <ProductView
                    product={selectedProduct}
                    onEdit={() => onEditProduct(selectedProduct)}
                    onDelete={() => {
                        handleDelete(selectedProduct);
                        onBack();
                    }}
                    onBack={onBack}
                    showBackButton={!isMobile}
                />
            </div>
        </div>
    );
}