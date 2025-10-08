'use client';

import { ProductFilters } from './ProductFilters';
import Link from 'next/link';
import { Package2 } from 'lucide-react';
import { useProductFilters } from '@/app/(company)/admin/products/product-filter-context';

export function ProductsSidebar() {
    const { allProducts } = useProductFilters();

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/admin" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">Products</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ProductFilters products={allProducts} />
                </div>
            </div>
        </div>
    );
}
