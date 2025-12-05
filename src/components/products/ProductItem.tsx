'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { memo } from 'react';
import { Product } from './types';

interface ProductItemProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product) => void;
}

export const ProductItem = memo(function ProductItem({ 
  product, 
  isSelected, 
  onSelect 
}: ProductItemProps) {
  return (
    <li
      onClick={() => onSelect(product)}
      className={cn(
        'p-4 cursor-pointer hover:bg-muted/50 transition-colors',
        isSelected && 'bg-muted'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border bg-muted">
          <Image
            src={product.imageUrl || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.jpg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {product.category} - {product.type}
          </p>
        </div>
      </div>
    </li>
  );
});
