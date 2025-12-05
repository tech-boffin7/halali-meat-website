'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Product } from './types';

import { ArrowLeft } from 'lucide-react';

interface ProductViewProps {
    product: Product;
    onEdit: () => void;
    onDelete: () => void;
    onBack?: () => void;
    showBackButton?: boolean;
}


export function ProductView({ product, onEdit, onDelete, onBack, showBackButton = true }: ProductViewProps) {
    return (
        <div className="flex flex-col h-full border bg-card rounded-lg shadow-sm overflow-x-hidden">
            <div className="flex items-center p-4 border-b">
                {onBack && showBackButton && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 md:hidden" data-tooltip="Back">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                <h2 className="text-xs font-semibold flex-1 truncate">{product.name}</h2>
                <div className="hidden md:flex gap-2">
                    <Button variant="outline" size="sm" onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={onDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
                <div className="flex md:hidden gap-2">
                    <Button variant="outline" size="icon" onClick={onEdit} data-tooltip="Edit Product">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={onDelete} data-tooltip="Delete Product">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="relative w-full max-w-2xl mx-auto aspect-square md:aspect-[4/3] mb-6 bg-muted/5 rounded-lg border overflow-hidden">
                    <Image
                        src={product.imageUrl || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        priority
                    />
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</p>
                            <p className="text-sm font-medium">{product.category}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</p>
                            <p className="text-sm font-medium">{product.type}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</p>
                            <p className="text-sm font-medium">
                                {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(product.price)}
                            </p>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
                        <p className="text-sm leading-relaxed text-foreground/90">{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
