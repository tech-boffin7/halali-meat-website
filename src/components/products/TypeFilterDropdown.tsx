
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

export function TypeFilterDropdown({ products }: { products: Product[] }) {
    const { selectedTypes, toggleType } = useProductFilters();
    const types = React.useMemo(() => getUniqueValues(products, 'type'), [products]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Type</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                {types.map((type) => (
                    <DropdownMenuCheckboxItem
                        key={type.normalized}
                        checked={selectedTypes.includes(type.normalized)}
                        onCheckedChange={() => toggleType(type.normalized)}
                    >
                        {type.display}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
