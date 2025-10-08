'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from './ProductsShell';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ProductItemProps {
    product: Product;
    isSelected: boolean;
    onSelect: () => void;
}

export function ProductItem({ product, isSelected, onSelect }: ProductItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onSelect}
            className={cn(
                'flex items-start gap-4 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent cursor-pointer',
                isSelected && 'bg-muted'
            )}
        >
            <Image
                src={product.image || '/images/placeholder.jpg'}
                alt={product.name}
                width={64}
                height={64}
                className="rounded-md object-cover"
            />
            <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <Badge variant={product.type === 'Frozen' ? 'secondary' : 'outline'} className="capitalize">
                        {product.type}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
            </div>
        </motion.div>
    );
}
