'use client';

import { replyToQuote } from '@/app/actions/quote-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QuoteStatus } from '@prisma/client';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, MoreVertical, Package, Reply, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ComposeReplyDialog } from './ComposeReplyDialog';
import { Quote } from './types';

interface QuoteViewProps {
  quote: Quote;
  onBackClick: () => void;
  onAction: (action: 'archive' | 'processed' | 'pending' | 'unarchive' | 'trash' | 'read' | 'unread' | 'responded', id: string) => void;
}

export function QuoteView({ quote, onBackClick, onAction }: QuoteViewProps) {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmTrash, setConfirmTrash] = useState(false);
  const hasMarkedAsRead = useRef(false);

  useEffect(() => {
    if (quote.status === QuoteStatus.UNREAD && !hasMarkedAsRead.current) {
      hasMarkedAsRead.current = true;
      onAction('read', quote.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote.id, quote.status]);

  useEffect(() => {
    hasMarkedAsRead.current = false;
  }, [quote.id]);

  const handleSendReply = useCallback(async (content: string) => {
    const result = await replyToQuote(quote.id, quote.email, content);
    if (result.success) {
      onAction('responded', quote.id);
      return true;
    } else {
      toast.error(result.message);
      return false;
    }
  }, [quote.id, quote.email, onAction]);

  const handleArchiveClick = () => {
    setConfirmArchive(true);
  };

  const handleArchiveConfirm = async () => {
    setConfirmArchive(false);
    await onAction('archive', quote.id);
    onBackClick();
  };

  const handleTrashClick = () => {
    setConfirmTrash(true);
  };

  const handleTrashConfirm = async () => {
    setConfirmTrash(false);
    await onAction('trash', quote.id);
    onBackClick();
  };

  const handleProcessAction = async () => {
    await onAction('processed', quote.id);
  };

  const handlePendingAction = async () => {
    await onAction('pending', quote.id);
  };

  const handleUnarchiveAction = async () => {
    await onAction('unarchive', quote.id);
    onBackClick();
  };

  return (
    <>
      <TooltipProvider>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex bg-secondary h-full flex-col"
        >
          <div className="flex items-center p-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onBackClick} data-tooltip="Back">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              {quote.status !== 'ARCHIVED' && (
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
              <Button variant="ghost" size="icon" onClick={() => setIsReplyDialogOpen(true)} data-tooltip="Reply">
                <Reply className="h-5 w-5" />
                <span className="sr-only">Reply</span>
              </Button>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {quote.status === 'PENDING' && (
                  <Button variant="ghost" size="icon" onClick={handleProcessAction} data-tooltip="Mark as Processed">
                      <CheckCircle className="h-5 w-5" />
                      <span className="sr-only">Mark as Processed</span>
                  </Button>
              )}
              {quote.status === 'PROCESSED' && (
                  <Button variant="ghost" size="icon" onClick={handlePendingAction} data-tooltip="Mark as Pending">
                      <Clock className="h-5 w-5" />
                      <span className="sr-only">Mark as Pending</span>
                  </Button>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-tooltip="More">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(quote.status === 'READ' || quote.status === 'RESPONDED') && (
                  <DropdownMenuItem onClick={() => onAction('unread', quote.id)}>Mark as unread</DropdownMenuItem>
                )}
                {quote.status === 'ARCHIVED' && (
                  <DropdownMenuItem onClick={handleUnarchiveAction}>Unarchive</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator />
          <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">
            <div className="flex items-start p-4">
              <div className="flex items-start gap-4 text-sm">
                <Avatar>
                  <AvatarImage alt={quote.name} />
                  <AvatarFallback>
                    {quote.name
                      .split(' ')
                      .map((chunk: string) => chunk[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold">{quote.name}</div>
                  <div className="line-clamp-1 text-xs">
                    <span className="font-medium">Email:</span>{" "}
                    {quote.email}
                  </div>
                  <div className="line-clamp-1 text-xs">
                    <span className="font-medium">Phone:</span>{" "}
                    {quote.phone}
                  </div>
                  {quote.company && (
                    <div className="line-clamp-1 text-xs">
                      <span className="font-medium">Company:</span>{" "}
                      {quote.company}
                    </div>
                  )}
                  {quote.productInterest && (
                    <div className="line-clamp-1 text-xs">
                      <span className="font-medium">Product:</span>{" "}
                      {quote.productInterest}
                    </div>
                  )}
                  {quote.quantity && (
                    <div className="line-clamp-1 text-xs">
                      <span className="font-medium">Quantity:</span>{" "}
                      {quote.quantity}
                    </div>
                  )}
                </div>
              </div>
              {quote.createdAt && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
            <Separator />
            <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              {quote.message}
            </div>
            {quote.replies && quote.replies.length > 0 && (
              <>
                <Separator />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Replies</h3>
                  <div className="space-y-4">
                    {quote.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage alt={reply.user.name} />
                          <AvatarFallback>
                            {reply.user.name.split(' ').map((chunk) => chunk[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="font-semibold">{reply.user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(reply.createdAt).toLocaleString()}
                          </div>
                          <div className="whitespace-pre-wrap text-sm">
                            {reply.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </TooltipProvider>

      <ComposeReplyDialog
        isOpen={isReplyDialogOpen}
        onClose={() => setIsReplyDialogOpen(false)}
        onSendReply={handleSendReply}
      />

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        onConfirm={handleArchiveConfirm}
        title="Archive Quote?"
        description="This quote will be moved to the archived folder. You can restore it later if needed."
        confirmButtonText="Archive"
      />

      <ConfirmationDialog
        isOpen={confirmTrash}
        onClose={() => setConfirmTrash(false)}
        onConfirm={handleTrashConfirm}
        title="Move to Trash?"
        description="This quote will be moved to trash. You can restore it later or delete it permanently."
        confirmButtonText="Move to Trash"
        confirmVariant="destructive"
      />
    </>
  );
}