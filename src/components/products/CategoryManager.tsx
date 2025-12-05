'use client';

import { deleteCategory, getCategories, renameCategory } from '@/app/actions/category-actions';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Check, Edit2, Loader2, Package, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Category {
  name: string;
  count: number;
}

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesUpdated?: () => void;
}

export function CategoryManager({ isOpen, onClose, onCategoriesUpdated }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);

  // Load categories when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      setSearchQuery('');
    }
  }, [isOpen]);

  const loadCategories = async () => {
    setIsLoading(true);
    const result = await getCategories();
    if (result.success) {
      setCategories(result.categories);
    } else {
      toast.error(result.error || 'Failed to load categories');
    }
    setIsLoading(false);
  };

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category.name);
    setEditValue(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const handleSaveEdit = async (oldName: string) => {
    if (!editValue || editValue.trim() === '') {
      toast.error('Category name cannot be empty');
      return;
    }

    if (editValue === oldName) {
      handleCancelEdit();
      return;
    }

    setIsSaving(true);
    const result = await renameCategory(oldName, editValue);
    setIsSaving(false);

    if (result.success) {
      toast.success(result.message);
      handleCancelEdit();
      loadCategories();
      onCategoriesUpdated?.();
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteClick = (category: Category) => {
    if (category.count > 0) {
      toast.error(`Cannot delete "${category.name}". It is used by ${category.count} product(s).`);
      return;
    }
    setConfirmDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    const result = await deleteCategory(confirmDelete.name);
    setConfirmDelete(null);

    if (result.success) {
      toast.success(result.message);
      loadCategories();
      onCategoriesUpdated?.();
    } else {
      toast.error(result.message);
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[calc(100%-20px)] max-h-[calc(100%-20px)] md:w-full md:h-auto md:max-w-2xl flex flex-col p-0 rounded-[10px]">
          {/* Mobile drag handle */}
          <div className="md:hidden flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-xl">Manage Product Categories</DialogTitle>
              <DialogDescription>
                View, edit, and manage your product categories. Category changes will update all related products.
              </DialogDescription>
            </DialogHeader>
          </div>

          <Separator />

          {/* Search Bar */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto px-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Loading categories...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">
                  {searchQuery ? 'No categories found' : 'No categories yet'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchQuery ? 'Try a different search term' : 'Categories will appear when you add products'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 pb-4">
                {filteredCategories.map((category) => (
                  <div
                    key={category.name}
                    className="group border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all bg-card"
                  >
                    <div className="flex items-center gap-3">
                      {/* Category Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>

                      {/* Category Name (Editable) */}
                      <div className="flex-1 min-w-0">
                        {editingCategory === category.name ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(category.name);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              disabled={isSaving}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleSaveEdit(category.name)}
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-sm truncate">{category.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {category.count} {category.count === 1 ? 'product' : 'products'}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      {editingCategory !== category.name && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleStartEdit(category)}
                            title="Edit category"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(category)}
                            disabled={category.count > 0}
                            title={category.count > 0 ? 'Cannot delete category in use' : 'Delete category'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Footer */}
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category?"
        description={`Are you sure you want to delete the category "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmVariant="destructive"
      />
    </>
  );
}
