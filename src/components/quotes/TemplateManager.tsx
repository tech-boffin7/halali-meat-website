'use client';

import { createTemplate, deleteTemplate, getTemplates, TemplateData, updateTemplate } from '@/app/actions/template-actions';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
}

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplatesUpdated: () => void;
}

export function TemplateManager({ isOpen, onClose, onTemplatesUpdated }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<TemplateData>({ name: '', content: '', isDefault: false });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setIsLoading(true);
    const result = await getTemplates();
    if (result.success && result.templates) {
      setTemplates(result.templates as Template[]);
    } else {
      toast.error(result.error || 'Failed to load templates');
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast.error('Name and content are required');
      return;
    }

    setIsSaving(true);
    let result;
    if (editingTemplate) {
      result = await updateTemplate(editingTemplate.id, formData);
    } else {
      result = await createTemplate(formData);
    }

    setIsSaving(false);

    if (result.success) {
      toast.success(editingTemplate ? 'Template updated' : 'Template created');
      setEditingTemplate(null);
      setIsCreating(false);
      setFormData({ name: '', content: '', isDefault: false });
      loadTemplates();
      onTemplatesUpdated();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    const result = await deleteTemplate(id);
    if (result.success) {
      toast.success('Template deleted');
      loadTemplates();
      onTemplatesUpdated();
    } else {
      toast.error(result.error);
    }
  };

  const startEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({ name: template.name, content: template.content, isDefault: template.isDefault });
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingTemplate(null);
    setFormData({ name: '', content: '', isDefault: false });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setEditingTemplate(null);
    setIsCreating(false);
    setFormData({ name: '', content: '', isDefault: false });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="
        w-[calc(100%-20px)] max-h-[calc(100%-20px)]
        md:w-full md:h-auto
        md:max-w-[600px]
        rounded-[10px]
        p-0 flex flex-col
      ">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 bg-background border-b px-4 py-3 flex items-center gap-3 z-10">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold text-lg">Manage Reply Templates</h2>
        </div>
        
        {/* Desktop header */}
        <div className="hidden md:block p-6 pb-4">
        <DialogHeader>
          <DialogTitle>Manage Reply Templates</DialogTitle>
          <DialogDescription>
            Create, edit, or delete templates for quote replies.
          </DialogDescription>
        </DialogHeader>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6">

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : isCreating || editingTemplate ? (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Standard Reply"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter template content..."
                  rows={8}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isDefault">Set as Default</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={cancelEdit} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button onClick={startCreate} className="w-full mb-4">
                <Plus className="mr-2 h-4 w-4" /> Create New Template
              </Button>
              {templates.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm">No templates found.</p>
              ) : (
                templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {template.name}
                        {template.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{template.content}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(template)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {!isCreating && !editingTemplate && (
          <DialogFooter className="sticky bottom-0 bg-background border-t md:static md:border-0 p-4 sm:p-6 mt-0 -mx-6 -mb-6">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
