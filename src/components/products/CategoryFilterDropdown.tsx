
'use client';

import * as React from 'react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useProductFilters } from '@/app/(company)/admin/products/product-filter-context';
import { Product } from './types';

interface UniqueValue {
    normalized: string;
    display: string;
}

const getUniqueValues = (products: Product[], key: 'category' | 'type'): UniqueValue[] => {
    const uniqueMap = new Map<string, string>(); // normalizedValue -> displayValue
    (products ?? []).forEach(p => {
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

export function CategoryFilterDropdown({ products }: { products: Product[] }) {
    const { selectedCategories, toggleCategory } = useProductFilters();
    const categories = React.useMemo(() => getUniqueValues(products, 'category'), [products]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Category</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                        key={category.normalized}
                        checked={selectedCategories.includes(category.normalized)}
                        onCheckedChange={() => toggleCategory(category.normalized)}
                    >
                        {category.display}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
