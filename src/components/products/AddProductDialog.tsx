'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Product } from './types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit: Product | null;
}

export function AddProductDialog({ isOpen, onClose, onSave, productToEdit }: AddProductDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (productToEdit) {
      reset(productToEdit);
    } else {
      reset({ name: '', category: '', type: '', description: '' });
    }
  }, [productToEdit, reset]);

  const onSubmit = (data: ProductFormData) => {
    const productToSave = {
      ...productToEdit,
      id: productToEdit?.id || Date.now().toString(),
      image: productToEdit?.image || '/images/placeholder.jpg',
      ...data,
    } as Product;
    onSave(productToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {productToEdit ? 'Update the details of the product.' : 'Fill in the details for the new product.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" {...register('name')} className="col-span-3" />
            {errors.name && <p className="col-span-4 text-red-500 text-xs text-right">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input id="category" {...register('category')} className="col-span-3" />
            {errors.category && <p className="col-span-4 text-red-500 text-xs text-right">{errors.category.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Input id="type" {...register('type')} className="col-span-3" />
            {errors.type && <p className="col-span-4 text-red-500 text-xs text-right">{errors.type.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" {...register('description')} className="col-span-3" />
            {errors.description && <p className="col-span-4 text-red-500 text-xs text-right">{errors.description.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{productToEdit ? 'Save Changes' : 'Add Product'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}