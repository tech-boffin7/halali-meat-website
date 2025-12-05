'use client';

import { getTemplates } from '@/app/actions/template-actions';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TemplateManager } from './TemplateManager';

interface Template {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
}

interface ReplyTemplateSelectorProps {
  onSelectTemplate: (content: string) => void;
}

export function ReplyTemplateSelector({ onSelectTemplate }: ReplyTemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadTemplates = async () => {
    setIsLoading(true);
    const result = await getTemplates();
    if (result.success && result.templates) {
      setTemplates(result.templates as Template[]);
      
      // Optional: Auto-select default template if needed, 
      // but usually we wait for user action.
      // const defaultTemplate = result.templates.find((t: any) => t.isDefault);
      // if (defaultTemplate) onSelectTemplate(defaultTemplate.content);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return (
    <div className="flex gap-2">
      <Select onValueChange={(value) => {
        const template = templates.find(t => t.id === value);
        if (template) {
          onSelectTemplate(template.content);
        }
      }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={isLoading ? "Loading templates..." : "Select a template..."} />
        </SelectTrigger>
        <SelectContent>
          {templates.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">No templates available</div>
          ) : (
            templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setIsManagerOpen(true)}
        title="Manage Templates"
      >
        <Settings className="h-4 w-4" />
      </Button>

      <TemplateManager 
        isOpen={isManagerOpen} 
        onClose={() => setIsManagerOpen(false)} 
        onTemplatesUpdated={loadTemplates}
      />
    </div>
  );
}
