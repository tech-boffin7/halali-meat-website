'use client';

import { forwardMessage, replyToMessage } from '@/app/actions/message-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { ArrowLeft, Forward, MessageSquare, MoreVertical, Package, Reply, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ForwardDialog } from './ForwardDialog';
import { ReplyDialog } from './ReplyDialog';
import { ThreadView } from './ThreadView';
import { Message, MessageType } from './types';

interface MessageViewProps {
  message: Message;
  onBackClick: () => void;
  onAction: (action: 'archive' | 'trash' | 'read' | 'unread' | 'unarchive', id: string) => void;
}

export function MessageView({ message, onBackClick, onAction }: MessageViewProps) {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmTrash, setConfirmTrash] = useState(false);
  const hasMarkedAsRead = useRef(false);

  useEffect(() => {
    if (message.type === MessageType.INBOUND && message.status === 'UNREAD' && !hasMarkedAsRead.current) {
      hasMarkedAsRead.current = true;
      onAction('read', message.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.id, message.status, message.type]);

  // Reset the ref when viewing a different message
  useEffect(() => {
    hasMarkedAsRead.current = false;
  }, [message.id]);

  const handleReply = () => {
    setIsReplyDialogOpen(true);
  };

  const handleForward = () => {
    setIsForwardDialogOpen(true);
  };

  const handleSendReply = async (content: string) => {
    // Pass message.id as parentMessageId to link the reply to this thread
    const result = await replyToMessage(message.email, message.subject, content, message.id);
    if (result.success) {
      toast.success('Reply sent successfully!');
    } else {
      toast.error(result.message || 'Failed to send reply.');
    }
  };

  const handleSendForward = async (recipientEmail: string, content: string) => {
    // Pass message.id as parentMessageId to track origin
    const result = await forwardMessage(recipientEmail, message.subject, content, message.id);
    if (result.success) {
      toast.success('Forward sent successfully!');
    } else {
      toast.error(result.message || 'Failed to send forward.');
    }
  };

  const handleArchiveClick = () => {
    setConfirmArchive(true);
  };

  const handleArchiveConfirm = async () => {
    setConfirmArchive(false);
    await onAction('archive', message.id);
    onBackClick();
  };

  const handleTrashClick = () => {
    setConfirmTrash(true);
  };

  const handleTrashConfirm = async () => {
    setConfirmTrash(false);
    await onAction('trash', message.id);
    onBackClick();
  };

  const handleUnarchiveAction = async () => {
    await onAction('unarchive', message.id);
    onBackClick();
  };

  return (
    <>
      <TooltipProvider>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex bg-secondary flex-col h-full"
        >
          <div className="flex items-center p-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onBackClick} data-tooltip="Back">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              {message.type === MessageType.INBOUND && message.status !== 'ARCHIVED' && (
                <Button variant="ghost" size="icon" onClick={handleArchiveClick} data-tooltip="Archive">
                  <Package className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
              )}
              
              <Button variant="ghost" size="icon" onClick={handleTrashClick} data-tooltip="Move to trash">
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Move to trash</span>
              </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {message.threadId && (
                <Dialog open={isThreadOpen} onOpenChange={setIsThreadOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="hidden sm:inline">View Conversation</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="
                      w-[calc(100%-20px)] max-h-[calc(100%-20px)]
                      md:w-full md:h-auto
                      md:max-w-3xl
                      rounded-[10px]
                      p-0 flex flex-col
                    ">
                        {/* Mobile header */}
                        <div className="md:hidden sticky top-0 bg-background border-b px-4 py-3 flex items-center gap-3 z-10">
                          <Button variant="ghost" size="icon" onClick={() => setIsThreadOpen(false)}>
                            <X className="h-5 w-5" />
                          </Button>
                          <h2 className="font-semibold text-lg">Conversation</h2>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <ThreadView threadId={message.threadId} onClose={() => setIsThreadOpen(false)} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {message.type === MessageType.INBOUND && (
              <Button variant="ghost" size="icon" onClick={handleReply} data-tooltip="Reply">
                <Reply className="h-5 w-5" />
                <span className="sr-only">Reply</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleForward} data-tooltip="Forward">
              <Forward className="h-5 w-5" />
              <span className="sr-only">Forward</span>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-tooltip="More">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {message.type === MessageType.INBOUND && message.status !== 'UNREAD' && (
                <DropdownMenuItem onClick={() => onAction('unread', message.id)}>Mark as unread</DropdownMenuItem>
              )}
              {message.status === 'ARCHIVED' && (
                <DropdownMenuItem onClick={handleUnarchiveAction}>Unarchive</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={message.name} />
                <AvatarFallback>
                  {message.name
                    .split(' ')
                    .map((chunk: string) => chunk[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{message.name}</div>
                <div className="line-clamp-1 text-xs">{message.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span>{" "}
                  {message.email}
                </div>
              </div>
            </div>
            {message.createdAt && (
              <div className="ml-auto text-xs text-muted-foreground">
                {new Date(message.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {message.body}
          </div>
        </div>
      </motion.div>
      <ReplyDialog
        open={isReplyDialogOpen}
        onOpenChange={setIsReplyDialogOpen}
        recipientEmail={message.email}
        subject={message.subject}
        originalBody={message.body}
        onSendReply={handleSendReply}
      />
      <ForwardDialog
        open={isForwardDialogOpen}
        onOpenChange={setIsForwardDialogOpen}
        body={message.body}
        subject={message.subject}
        onSendForward={handleSendForward}
      />
    </TooltipProvider>

    {/* Confirmation Dialogs */}
    <ConfirmationDialog
      isOpen={confirmArchive}
      onClose={() => setConfirmArchive(false)}
      onConfirm={handleArchiveConfirm}
      title="Archive Message?"
      description="This message will be moved to the archived folder. You can restore it later if needed."
      confirmButtonText="Archive"
    />

    <ConfirmationDialog
      isOpen={confirmTrash}
      onClose={() => setConfirmTrash(false)}
      onConfirm={handleTrashConfirm}
      title="Move to Trash?"
      description="This message will be moved to trash. You can restore it later or delete it permanently."
      confirmButtonText="Move to Trash"
      confirmVariant="destructive"
    />
    </>
  );
}