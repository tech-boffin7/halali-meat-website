'use client';

import { useProductFilters } from '@/app/(company)/admin/products/product-filter-context';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Tag } from 'lucide-react';
import * as React from 'react';
import { Product } from './types';

interface UniqueValue {
    normalized: string;
    display: string;
}

const getUniqueValues = (products: Product[], key: 'category' | 'type'): UniqueValue[] => {
    const uniqueMap = new Map<string, string>(); // normalizedValue -> displayValue
    products.forEach(p => {
        const displayValue = p[key];
        if (displayValue === undefined || displayValue === null) {
            return; // Skip if value is undefined or null
        }
        const normalizedValue = String(displayValue).trim().toLowerCase();
        if (!uniqueMap.has(normalizedValue)) {
            uniqueMap.set(normalizedValue, displayValue);
        }
    });
    return Array.from(uniqueMap.entries())
                .map(([normalized, display]) => ({ normalized, display }))
                .sort((a, b) => a.display.localeCompare(b.display)); // Sort by display value
};

export function ProductFilters({ products }: { products: Product[] }) {
    const { selectedCategories, toggleCategory, selectedTypes, toggleType, clearFilters } = useProductFilters();

    const categories = React.useMemo(() => getUniqueValues(products, 'category'), [products]);
    const types = React.useMemo(() => getUniqueValues(products, 'type'), [products]);

    const hasActiveFilters = selectedCategories.length > 0 || selectedTypes.length > 0;

    return (
        <TooltipProvider>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2 px-2 lg:px-0">
                        <h3 className="text-xs font-semibold text-muted-foreground">Categories</h3>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={clearFilters}
                                    disabled={!hasActiveFilters}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    <span className="sr-only">Clear filters</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Clear filters</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="grid gap-1">
                        {categories.map((item) => (
                            <Button
                                key={item.normalized}
                                variant={selectedCategories.includes(item.normalized) ? 'default' : 'ghost'}
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => toggleCategory(item.normalized)}
                            >
                                <Tag className="mr-2 h-4 w-4" />
                                {item.display}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="mb-2 px-2 lg:px-0 text-xs font-semibold text-muted-foreground">Type</h3>
                    <div className="grid gap-1">
                        {types.map((item) => (
                            <Button
                                key={item.normalized}
                                variant={selectedTypes.includes(item.normalized) ? 'default' : 'ghost'}
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => toggleType(item.normalized)}
                            >
                                <Tag className="mr-2 h-4 w-4" />
                                {item.display}
                            </Button>
                        ))}
                    </div>
                </div>
            </nav>
        </TooltipProvider>
    );
}
