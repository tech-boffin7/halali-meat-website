import { sendComposedMessage } from '@/app/actions/message-actions';
import { scheduleMessage } from '@/app/actions/message-advanced-actions';
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
import { ActionResponse, composeMessageSchema } from '@/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarClock, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { SchedulePicker } from './SchedulePicker';

type ComposeMessageFormValues = z.infer<typeof composeMessageSchema>;

export function ComposeDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

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
      let result: ActionResponse;

      if (scheduledDate) {
        // Handle scheduled message
        const scheduleResult = await scheduleMessage(
            {
                to: data.to,
                subject: data.subject,
                body: data.body
            },
            scheduledDate
        );
        
        // Map scheduleResult to ActionResponse format
        result = {
            success: scheduleResult.success,
            message: scheduleResult.message,
            // @ts-expect-error - data property might not exist on ActionResponse but we handle it
            data: scheduleResult.data
        };
      } else {
        // Handle immediate send
        const formData = new FormData();
        formData.append('to', data.to);
        formData.append('subject', data.subject);
        formData.append('body', data.body);
        result = await sendComposedMessage(formData);
      }

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        form.reset();
        setScheduledDate(null);
      } else {
        toast.error(result.message || 'Failed to send message.');
        if (result.errors) {
          for (const field in result.errors) {
            form.setError(field as keyof ComposeMessageFormValues, { message: result.errors[field]?.[0] });
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
            
            {/* Scheduled Date Indicator */}
            {scheduledDate && (
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-md text-sm">
                    <CalendarClock className="h-4 w-4" />
                    <span>Scheduled for: {format(scheduledDate, 'MMM d, yyyy h:mm a')}</span>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-auto hover:bg-primary/20"
                        onClick={() => setScheduledDate(null)}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}

            <DialogFooter className="flex justify-between sm:justify-between items-center w-full sticky bottom-0 bg-background border-t md:static md:border-0 p-4 sm:p-6 mt-0 -mx-6 -mb-6">
              <div className="flex gap-2">
                 <SchedulePicker onSchedule={setScheduledDate}>
                    <Button type="button" variant="outline" size="sm" className="gap-2 h-11 md:h-9" data-tooltip="Schedule Send">
                        <CalendarClock className="h-4 w-4" />
                        <span>Schedule Message</span>
                    </Button>
                 </SchedulePicker>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled={isLoading} className="h-11 md:h-9 px-6 md:px-4">
                    {isLoading ? 'Processing...' : (scheduledDate ? 'Schedule' : 'Send')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{scheduledDate ? 'Schedule message' : 'Send message'}</p>
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
