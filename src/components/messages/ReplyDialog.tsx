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
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientEmail: string;
  subject: string;
  originalBody: string;
  onSendReply: (content: string) => void;
}

export function ReplyDialog({ open, onOpenChange, recipientEmail, subject, originalBody, onSendReply }: ReplyDialogProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open) {
      setContent(`\n\n-------- Original Message --------\nSubject: ${subject}\nFrom: ${recipientEmail}\n\n${originalBody}`);
    } else {
      setContent(''); // Clear content when dialog closes
    }
  }, [open, subject, recipientEmail, originalBody]);

  const handleSelectTemplate = (templateContent: string) => {
    setContent(templateContent + content);
  };

  const handleSend = () => {
    onSendReply(content);
    onOpenChange(false);
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
            <h2 className="font-semibold text-lg">Reply to Message</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="hidden md:block pt-6">
            <DialogHeader>
              <DialogTitle>Reply to Message</DialogTitle>
            </DialogHeader>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to" className="text-right">
                To
              </Label>
              <Input id="to" value={recipientEmail} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input id="subject" value={`Re: ${subject}`} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ReplyTemplateSelector onSelectTemplate={handleSelectTemplate} />
              <Textarea placeholder="Type your message here." value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[150px]" />
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 bg-background border-t md:static md:border-0 p-4 sm:p-6 mt-0 -mx-6 -mb-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" onClick={handleSend} className="h-11 md:h-9 px-6 md:px-4">Send</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send reply</p>
              </TooltipContent>
            </Tooltip>
          </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
