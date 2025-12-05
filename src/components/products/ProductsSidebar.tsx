'use client';

import { useProductFilters } from '@/app/(company)/admin/products/product-filter-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowUpDown, Package2, Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { ProductList } from './ProductList';
import { ProductListSkeleton } from './ProductListSkeleton';
import { Product } from './types';

interface ProductsSidebarProps {
    selectedProduct: Product | null;
    onSelectProduct: (product: Product) => void;
    isMobile?: boolean;
}

interface UniqueValue {
    normalized: string;
    display: string;
}

const getUniqueValues = (products: Product[], key: 'category' | 'type'): UniqueValue[] => {
    const uniqueMap = new Map<string, string>();
    products.forEach(p => {
        const displayValue = p[key];
        if (displayValue === undefined || displayValue === null) return;
        const normalizedValue = String(displayValue).trim().toLowerCase();
        if (!uniqueMap.has(normalizedValue)) {
            uniqueMap.set(normalizedValue, displayValue);
        }
    });
    return Array.from(uniqueMap.entries())
                .map(([normalized, display]) => ({ normalized, display }))
                .sort((a, b) => a.display.localeCompare(b.display));
};

export function ProductsSidebar({ selectedProduct, onSelectProduct, isMobile = false }: ProductsSidebarProps) {
    const { 
        products, 
        onAddProduct, 
        loadMore, 
        hasMore, 
        isLoading,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedCategories,
        toggleCategory,
        selectedTypes,
        toggleType,
        clearFilters
    } = useProductFilters();

    const categories = React.useMemo(() => getUniqueValues(products, 'category'), [products]);
    const types = React.useMemo(() => getUniqueValues(products, 'type'), [products]);
    const activeFiltersCount = selectedCategories.length + selectedTypes.length;

    // Filter content component (reusable for mobile sheet and desktop sidebar)
    const FilterContent = () => (
        <div className="space-y-3">
            {/* Category Filters */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">CATEGORY</span>
                    {selectedCategories.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => selectedCategories.forEach(cat => toggleCategory(cat))}
                            data-tooltip="Clear categories"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {categories.map((item) => (
                        <Badge
                            key={item.normalized}
                            variant={selectedCategories.includes(item.normalized) ? "default" : "outline"}
                            className="cursor-pointer text-xs px-2 py-0.5"
                            onClick={() => toggleCategory(item.normalized)}
                        >
                            {item.display}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Type Filters */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">TYPE</span>
                    {selectedTypes.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => selectedTypes.forEach(type => toggleType(type))}
                            data-tooltip="Clear types"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {types.map((item) => (
                        <Badge
                            key={item.normalized}
                            variant={selectedTypes.includes(item.normalized) ? "default" : "outline"}
                            className="cursor-pointer text-xs px-2 py-0.5"
                            onClick={() => toggleType(item.normalized)}
                        >
                            {item.display}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Clear All */}
            {activeFiltersCount > 0 && (
                <>
                    <Separator />
                    <Button 
                        variant="ghost" 
                        onClick={clearFilters} 
                        className="w-full h-8 text-xs"
                    >
                        Clear All ({activeFiltersCount})
                    </Button>
                </>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile: Full-screen list */}
            {isMobile && (
                <div className="flex flex-col h-full w-full bg-muted/40">
                    {/* Header */}
                    <div className="flex h-14 items-center justify-between border-b px-4 shrink-0">
                        <div className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span>Products</span>
                        </div>
                        <Button 
                            onClick={onAddProduct} 
                            size="icon" 
                            className="h-8 w-8"
                            data-tooltip="Add Product"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="p-3 border-b shrink-0">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 h-9 text-sm"
                            />
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="px-3 py-2 border-b shrink-0">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-8 text-xs border-none shadow-none focus:ring-0 px-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt_desc">Newest</SelectItem>
                                    <SelectItem value="createdAt_asc">Oldest</SelectItem>
                                    <SelectItem value="name_asc">Name A-Z</SelectItem>
                                    <SelectItem value="name_desc">Name Z-A</SelectItem>
                                    <SelectItem value="price_asc">Price Low-High</SelectItem>
                                    <SelectItem value="price_desc">Price High-Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-3 border-b shrink-0">
                        <FilterContent />
                    </div>

                    {/* Product List */}
                    <div className="flex-1 overflow-y-auto px-2 py-3">
                        {isLoading && products.length === 0 ? (
                            <ProductListSkeleton />
                        ) : (
                            <>
                                <ProductList 
                                    products={products}
                                    selectedProduct={selectedProduct}
                                    onSelectProduct={onSelectProduct}
                                    onAddProduct={onAddProduct}
                                />
                                {hasMore && (
                                    <div className="p-2">
                                        <Button 
                                            variant="outline" 
                                            onClick={loadMore} 
                                            disabled={isLoading}
                                            className="w-full h-8 text-xs"
                                        >
                                            {isLoading ? 'Loading...' : 'Load More'}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden border-r bg-muted/40 md:flex md:flex-col md:sticky md:top-0 p-1">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 shrink-0">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="">Products</span>
                        </Link>
                        <Button 
                            onClick={onAddProduct} 
                            size="icon" 
                            className="h-8 w-8 ml-auto"
                            data-tooltip="Add Product"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="p-3 border-b shrink-0">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 h-9 text-sm"
                            />
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="px-3 py-2 border-b shrink-0">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-8 text-xs border-none shadow-none focus:ring-0 px-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt_desc">Newest</SelectItem>
                                    <SelectItem value="createdAt_asc">Oldest</SelectItem>
                                    <SelectItem value="name_asc">Name A-Z</SelectItem>
                                    <SelectItem value="name_desc">Name Z-A</SelectItem>
                                    <SelectItem value="price_asc">Price Low-High</SelectItem>
                                    <SelectItem value="price_desc">Price High-Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-3 border-b shrink-0">
                        <FilterContent />
                    </div>

                    {/* Product List - with thin scrollbar */}
                    <div 
                        className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin"
                        style={{ height: 'calc(100vh - 456px)' }}
                    >
                        {isLoading && products.length === 0 ? (
                            <ProductListSkeleton />
                        ) : (
                            <>
                                <ProductList 
                                    products={products}
                                    selectedProduct={selectedProduct}
                                    onSelectProduct={onSelectProduct}
                                    onAddProduct={onAddProduct}
                                />
                                {hasMore && (
                                    <div className="p-2">
                                        <Button 
                                            variant="outline" 
                                            onClick={loadMore} 
                                            disabled={isLoading}
                                            className="w-full h-8 text-xs"
                                        >
                                            {isLoading ? 'Loading...' : 'Load More'}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile would go here but simplified for now */}
        </>
    );
}
