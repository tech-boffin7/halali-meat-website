'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from './types';
import Image from 'next/image';

import { ArrowLeft } from 'lucide-react';

interface ProductViewProps {
    product: Product;
    onEdit: () => void;
    onDelete: () => void;
    onBack?: () => void;
}

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ProductView({ product, onEdit, onDelete, onBack }: ProductViewProps) {
    return (
        <div className="flex flex-col h-full border bg-card rounded-lg shadow-sm">
            <div className="flex items-center p-4 border-b">
                {onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 md:hidden">
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
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={onEdit}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Edit Product</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={onDelete}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Delete Product</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <Image
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name}
                    width={256}
                    height={256}
                    className="w-full h-64 object-cover rounded-md mb-4"
                />
                <p className="text-sm text-muted-foreground mb-2">
                    <strong>Category:</strong> {product.category}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                    <strong>Type:</strong> {product.type}
                </p>
                <Separator className="my-4" />
                <p className="text-sm">{product.description}</p>
            </div>
        </div>
    );
}
