import { sendComposedMessage } from '@/app/actions/message-actions';
import { saveDraft } from '@/app/actions/message-advanced-actions';
import { ReplyTemplateSelector } from '@/components/quotes/ReplyTemplateSelector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { composeMessageSchema } from '@/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type ComposeMessageFormValues = z.infer<typeof composeMessageSchema>;

export function ComposeDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const form = useForm<ComposeMessageFormValues>({
    resolver: zodResolver(composeMessageSchema),
    defaultValues: {
      to: '',
      subject: '',
      body: '',
    },
  });

  const onSubmit = async (data: ComposeMessageFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('to', data.to);
      formData.append('subject', data.subject);
      formData.append('body', data.body);
      const result = await sendComposedMessage(formData);

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(result.message || 'Failed to send message.');
        if (result.errors) {
          const errors = result.errors as Record<string, string[]>;
          for (const field in errors) {
            form.setError(field as keyof ComposeMessageFormValues, { message: errors[field]?.[0] });
          }
        }
      }
    } catch (error) {
      console.error('Error sending composed message:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    const data = form.getValues();
    
    // Basic validation - at least have recipient and some content
    if (!data.to || (!data.subject && !data.body)) {
      toast.error('Please add recipient and some content before saving draft');
      return;
    }

    setIsSavingDraft(true);
    try {
      const result = await saveDraft({
        to: data.to,
        subject: data.subject || '(No subject)',
        body: data.body || '',
      });

      if (result.success) {
        toast.success('Draft saved successfully!');
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(result.message || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSelectTemplate = (content: string) => {
    form.setValue('body', content);
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="
          w-[calc(100%-20px)] max-h-[calc(100%-20px)]
          md:w-full md:h-auto
          md:max-w-[625px]
          rounded-[10px]
          p-0 flex flex-col
        ">
          {/* Mobile header with close button */}
          <div className="md:hidden sticky top-0 bg-background border-b px-4 py-3 flex items-center gap-3 z-10">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
            <h2 className="font-semibold text-lg">Compose Message</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="hidden md:block pt-6">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
            </DialogHeader>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to" className="text-right">
                To
              </Label>
              <Input id="to" {...form.register('to')} className="col-span-3" />
              {form.formState.errors.to && (
                <p className="col-span-4 text-right text-sm text-red-500">{form.formState.errors.to.message}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input id="subject" {...form.register('subject')} className="col-span-3" />
              {form.formState.errors.subject && (
                <p className="col-span-4 text-right text-sm text-red-500">{form.formState.errors.subject.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ReplyTemplateSelector onSelectTemplate={handleSelectTemplate} />
              <Textarea placeholder="Type your message here." {...form.register('body')} className="min-h-[150px]" />
              {form.formState.errors.body && (
                <p className="text-sm text-red-500">{form.formState.errors.body.message}</p>
              )}
            </div>

            <DialogFooter className="flex justify-between sm:justify-between items-center w-full sticky bottom-0 bg-background border-t md:static md:border-0 p-4 sm:p-6 mt-0 -mx-6 -mb-6">
              <div className="flex gap-2">
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button 
                       type="button" 
                       variant="outline" 
                       size="sm" 
                       className="gap-2 h-11 md:h-9" 
                       onClick={handleSaveDraft}
                       disabled={isSavingDraft}
                     >
                         <Save className="h-4 w-4" />
                         <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p>Save message as draft to send later</p>
                   </TooltipContent>
                 </Tooltip>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled={isLoading} className="h-11 md:h-9 px-6 md:px-4">
                    {isLoading ? 'Sending...' : 'Send'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message now</p>
                </TooltipContent>
              </Tooltip>
            </DialogFooter>
          </form>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
