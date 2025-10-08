'use client';

import { useProductFilters } from '@/app/(company)/admin/products/product-filter-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Product } from './types';
import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
    const { searchQuery, setSearchQuery, onAddProduct, selectedCategories, toggleCategory, selectedTypes, toggleType, clearFilters } = useProductFilters();

    const hasActiveFilters = selectedCategories.length > 0 || selectedTypes.length > 0;

    const categories = React.useMemo(() => getUniqueValues(products, 'category'), [products]);
    const types = React.useMemo(() => getUniqueValues(products, 'type'), [products]);

    return (
        <div className="w-full flex items-center gap-4 py-3">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full md:w-2/3 lg:w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Filter className="h-4 w-4" />
                        <span className="sr-only">Filters</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-xs">
                    <SheetHeader className="text-left">
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription className="text-xs">Refine the product list by category and type.</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <h5 className="text-sm font-medium mb-2 px-1">Category</h5>
                            <div className="grid gap-2">
                                {categories.map((item) => (
                                    <div key={item.normalized} className="flex items-center space-x-2 px-1">
                                        <Checkbox 
                                            id={`cat-${item.normalized}`}
                                            checked={selectedCategories.includes(item.normalized)}
                                            onCheckedChange={() => toggleCategory(item.normalized)}
                                        />
                                        <Label htmlFor={`cat-${item.normalized}`} className="text-sm font-normal w-full cursor-pointer">{item.display}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h5 className="text-sm font-medium mb-2 px-1">Type</h5>
                            <div className="grid gap-2">
                                {types.map((item) => (
                                    <div key={item.normalized} className="flex items-center space-x-2 px-1">
                                        <Checkbox 
                                            id={`type-${item.normalized}`}
                                            checked={selectedTypes.includes(item.normalized)}
                                            onCheckedChange={() => toggleType(item.normalized)}
                                        />
                                        <Label htmlFor={`type-${item.normalized}`} className="text-sm font-normal w-full cursor-pointer">{item.display}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={clearFilters} className="w-full">
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
            <Button onClick={onAddProduct} size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
            </Button>
        </div>
    );
}
