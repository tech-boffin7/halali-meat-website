
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
import { useState } from 'react';
import { toast } from 'sonner';

interface AddNewCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: (newCategory: string) => void;
}

export function AddNewCategoryDialog({ isOpen, onClose, onCategoryAdded }: AddNewCategoryDialogProps) {
  const [newCategory, setNewCategory] = useState('');

  const handleSave = () => {
    if (newCategory.trim() === '') {
      toast.error('Category name cannot be empty.');
      return;
    }
    onCategoryAdded(newCategory);
    toast.success(`Category "${newCategory}" added.`);
    onClose();
    setNewCategory('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-20px)] sm:w-full sm:max-w-[425px] rounded-[10px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Enter the name for the new product category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid md:grid-cols-4 items-center gap-4">
            <Label htmlFor="new-category" className="md:text-right">Category Name</Label>
            <Input
              id="new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="md:col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button type="button" variant="ghost" onClick={onClose} className="h-11 md:h-9 w-full sm:w-auto">Cancel</Button>
          <Button type="submit" onClick={handleSave} className="h-11 md:h-9 w-full sm:w-auto">Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
