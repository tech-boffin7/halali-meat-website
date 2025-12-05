'use client';

import { useProductFilters } from '@/app/(company)/admin/products/product-filter-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, FolderEdit, PlusCircle, Search, X } from 'lucide-react';
import * as React from 'react';
import { CategoryManager } from './CategoryManager';
import { Product } from './types';

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

export function ProductsNavbar({ products }: { products: Product[] }) {
    const { 
        searchQuery, 
        setSearchQuery, 
        onAddProduct, 
        selectedCategories, 
        toggleCategory, 
        selectedTypes, 
        toggleType, 
        sortBy,
        setSortBy,
        clearFilters 
    } = useProductFilters();

    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = React.useState(false);

    const categories = React.useMemo(() => getUniqueValues(products, 'category'), [products]);
    const types = React.useMemo(() => getUniqueValues(products, 'type'), [products]);

    const activeFiltersCount = selectedCategories.length + selectedTypes.length;

    return (
        <div className="w-full space-y-4">
            {/* Desktop filters */}
            <div className="hidden md:flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-8 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] text-sm">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt_desc">Newest First</SelectItem>
                        <SelectItem value="createdAt_asc">Oldest First</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        <SelectItem value="name_asc">Name: A-Z</SelectItem>
                        <SelectItem value="name_desc">Name: Z-A</SelectItem>
                    </SelectContent>
                </Select>

                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsCategoryManagerOpen(true)}
                    className="gap-2"
                >
                    <FolderEdit className="h-4 w-4" />
                    <span className="hidden xl:inline">Manage Categories</span>
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="relative text-sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium leading-none">Categories</h4>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((item) => (
                                        <Badge
                                            key={item.normalized}
                                            variant={selectedCategories.includes(item.normalized) ? "default" : "outline"}
                                            className="cursor-pointer text-xs"
                                            onClick={() => toggleCategory(item.normalized)}
                                        >
                                            {item.display}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium leading-none">Type</h4>
                                <div className="flex flex-wrap gap-2">
                                    {types.map((item) => (
                                        <Badge
                                            key={item.normalized}
                                            variant={selectedTypes.includes(item.normalized) ? "default" : "outline"}
                                            className="cursor-pointer text-xs"
                                            onClick={() => toggleType(item.normalized)}
                                        >
                                            {item.display}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            {activeFiltersCount > 0 && (
                                <>
                                    <Separator />
                                    <Button variant="ghost" className="w-full text-sm" onClick={clearFilters}>
                                        Clear all filters
                                    </Button>
                                </>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
                {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0" data-tooltip="Clear filters">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear filters</span>
                    </Button>
                )}
                <Button onClick={onAddProduct} size="sm" className="h-9 text-sm gap-1.5">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden lg:inline">Add Product</span>
                </Button>
            </div>

            {/* Mobile layout */}
            <div className="flex md:hidden items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8 text-base md:text-sm h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                            <Filter className="h-4 w-4" />
                            <span className="sr-only">Filters</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs">
                        <SheetHeader className="text-left">
                            <SheetTitle className="text-sm">Filters & Sort</SheetTitle>
                            <SheetDescription className="text-xs">Refine your product search</SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <h5 className="text-sm font-medium mb-2">Sort By</h5>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="createdAt_desc">Newest First</SelectItem>
                                        <SelectItem value="createdAt_asc">Oldest First</SelectItem>
                                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                        <SelectItem value="name_asc">Name: A-Z</SelectItem>
                                        <SelectItem value="name_desc">Name: Z-A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setIsCategoryManagerOpen(true)}
                                className="gap-2"
                            >
                                <FolderEdit className="h-4 w-4" />
                                <span className="hidden lg:inline">Manage Categories</span>
                            </Button>
                            <Separator />
                            <div>
                                <h5 className="text-sm font-medium mb-2">Categories</h5>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((item) => (
                                        <Badge
                                            key={item.normalized}
                                            variant={selectedCategories.includes(item.normalized) ? "default" : "outline"}
                                            className="cursor-pointer text-xs"
                                            onClick={() => toggleCategory(item.normalized)}
                                        >
                                            {item.display}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <h5 className="text-sm font-medium mb-2">Type</h5>
                                <div className="flex flex-wrap gap-2">
                                    {types.map((item) => (
                                        <Badge
                                            key={item.normalized}
                                            variant={selectedTypes.includes(item.normalized) ? "default" : "outline"}
                                            className="cursor-pointer text-xs"
                                            onClick={() => toggleType(item.normalized)}
                                        >
                                            {item.display}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            {activeFiltersCount > 0 && (
                                <>
                                    <Separator />
                                    <Button variant="ghost" onClick={clearFilters} className="w-full text-sm">
                                        Clear Filters
                                    </Button>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
                <Button onClick={onAddProduct} size="icon" className="h-9 w-9 shrink-0">
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Add Product</span>
                </Button>
            </div>

            {/* Category Manager Dialog */}
            <CategoryManager
                isOpen={isCategoryManagerOpen}
                onClose={() => setIsCategoryManagerOpen(false)}
            />
        </div>
    );
}
