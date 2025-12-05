
'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { AddNewCategoryDialog } from './AddNewCategoryDialog';
import { Product } from './types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be a positive number'),
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  productToEdit: Product | null;
}

export function AddProductDialog({ isOpen, onClose, onSave, productToEdit }: AddProductDialogProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); // Track uploaded image

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/products/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch {
        toast.error('Failed to load categories');
      } finally {
        // This finally block and the fetchCategories() call within it seem misplaced
        // and would cause an infinite loop if uncommented as per the user's snippet.
        // The original code had a console.error in the catch block.
        // Keeping the original structure but removing the 'error' variable as requested.
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productToEdit) {
      reset(productToEdit);
      setImagePreview(productToEdit.imageUrl);
      setUploadedImageUrl(null); // Editing existing product, no new upload yet
    } else {
      reset({ name: '', category: '', type: '', description: '', price: 0, imageUrl: '' });
      setImagePreview(null);
      setUploadedImageUrl(null);
    }
  }, [productToEdit, reset]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Uploading image...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setValue('imageUrl', url, { shouldValidate: true });
        setImagePreview(url);
        setUploadedImageUrl(url); // Track this upload
        toast.success('Image uploaded successfully!', { id: toastId });
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      toast.error('Image upload failed.', { id: toastId });
    }
  };

  // Cleanup orphaned image when dialog is closed without saving
  const handleClose = async () => {
    // Only delete if it's a NEW product (not editing) and an image was uploaded
    if (!productToEdit && uploadedImageUrl) {
      try {
        await fetch('/api/upload/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: uploadedImageUrl }),
        });
      } catch (error) {
        console.error('Failed to delete orphaned image:', error);
      }
    }
    setUploadedImageUrl(null);
    onClose();
  };

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('type', data.type);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('imageUrl', data.imageUrl);
    setUploadedImageUrl(null); // Clear tracking since we're saving the product
    onSave(formData);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="
          w-[calc(100%-20px)] max-h-[calc(100%-20px)]
          md:w-full md:h-auto
          max-w-[calc(100%-20px)] md:max-w-[525px]
          rounded-[10px]
          p-0 flex flex-col
        ">
          {/* Mobile header with close button */}
          <div className="md:hidden sticky top-0 bg-background border-b px-4 py-3 flex items-center gap-3 z-10">
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
            <h2 className="font-semibold text-lg">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          
          {/* Desktop header */}
          <div className="hidden md:block p-6 pb-4">
          <DialogHeader>
            <DialogTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {productToEdit ? 'Update the details of the product.' : 'Fill in the details for the new product.'}
            </DialogDescription>
          </DialogHeader>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 md:px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="md:text-right">Name</Label>
              <Input id="name" {...register('name')} className="md:col-span-3" />
              {errors.name && <p className="md:col-span-4 text-red-500 text-xs text-right">{errors.name.message}</p>}
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="md:text-right">Category</Label>
              <div className="md:col-span-3 flex items-center gap-2">
                <Select onValueChange={(value) => setValue('category', value)} value={watch('category')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="icon" onClick={() => setIsCategoryDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              {errors.category && <p className="md:col-span-4 text-red-500 text-xs text-right">{errors.category.message}</p>}
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="md:text-right">Type</Label>
              <Select onValueChange={(value) => setValue('type', value)} value={watch('type')} >
                <SelectTrigger className="md:col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHILLED">Chilled</SelectItem>
                  <SelectItem value="FROZEN">Frozen</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="md:col-span-4 text-red-500 text-xs text-right">{errors.type.message}</p>}
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="md:text-right">Description</Label>
              <Textarea id="description" {...register('description')} className="md:col-span-3" />
              {errors.description && <p className="md:col-span-4 text-red-500 text-xs text-right">{errors.description.message}</p>}
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="md:text-right">Price</Label>
              <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="md:col-span-3" />
              {errors.price && <p className="md:col-span-4 text-red-500 text-xs text-right">{errors.price.message}</p>}
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="md:text-right">Image</Label>
              <div className="md:col-span-3">
                <Input id="imageUrl" type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
                {imagePreview && (
                  <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden border">
                    <Image src={imagePreview} alt="Image preview" fill className="object-contain" />
                  </div>
                )}
              </div>
              {errors.imageUrl && <p className="md:col-span-4 text-red-500 text-xs text-right">{errors.imageUrl.message}</p>}
            </div>
            <DialogFooter className="flex-col-reverse sm:flex-row">
              <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button type="submit">{productToEdit ? 'Save Changes' : 'Add Product'}</Button>
            </DialogFooter>
          </form>
          </div>
        </DialogContent>
      </Dialog>
      <AddNewCategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onCategoryAdded={(newCategory) => {
          setCategories([...categories, newCategory]);
          setValue('category', newCategory);
        }}
      />
    </>
  );
}
