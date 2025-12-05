
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { ReplyTemplateSelector } from './ReplyTemplateSelector';

interface ComposeReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSendReply: (content: string) => Promise<boolean>;
}

export function ComposeReplyDialog({ isOpen, onClose, onSendReply }: ComposeReplyDialogProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (content.trim() === '') {
      toast.error('Reply content cannot be empty.');
      return;
    }
    setIsSending(true);

    const success = await onSendReply(content);
    setIsSending(false);
    
    if (success) {
      onClose();
      setContent('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-20px)] sm:w-full sm:max-w-[625px] max-h-[85vh] flex flex-col rounded-[10px]">
        <DialogHeader>
          <DialogTitle>Compose Reply</DialogTitle>
          <DialogDescription>
            Write your reply to the customer. The reply will be sent as an email.
          </DialogDescription>
        </DialogHeader>


        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label>Template</Label>
            <ReplyTemplateSelector onSelectTemplate={setContent} />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="reply-content">Message</Label>
            <Textarea
              id="reply-content"
              placeholder="Type your message here."
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 bg-background border-t md:static md:border-0 p-4 sm:p-6 mt-0 -mx-6 -mb-6">
          <Button type="button" variant="ghost" onClick={onClose} className="h-11 md:h-9 px-6 md:px-4">Cancel</Button>
          <Button type="submit" onClick={handleSend} disabled={isSending} className="h-11 md:h-9 px-6 md:px-4">
            {isSending ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
