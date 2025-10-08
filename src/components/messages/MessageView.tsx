'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Archive, Forward, MoreVertical, Reply, ReplyAll, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Message {
  id: string;
  type: 'inbox' | 'sent' | 'archived';
  read: boolean;
  sender: {
    name: string;
    email: string;
  };
  subject: string;
  body: string;
  date: string;
  labels: string[];
}

interface MessageViewProps {
  message: Message;
  onBackClick: () => void;
  onAction: (action: 'archive' | 'trash' | 'unread', id: string) => void;
}

export function MessageView({ message, onBackClick, onAction }: MessageViewProps) {

  const handleReply = () => {
    window.open(`mailto:${message.sender.email}?subject=Re: ${message.subject}`, '_blank');
  };

  const handleReplyAll = () => {
    // In a real app, you'd get all recipients
    window.open(`mailto:${message.sender.email}?subject=Re: ${message.subject}`, '_blank');
  };

  const handleForward = () => {
    const body = encodeURIComponent(`\n\n--- Forwarded message ---\nFrom: ${message.sender.name} <${message.sender.email}>\nDate: ${message.date}\nSubject: ${message.subject}\n\n${message.body}`);
    window.open(`mailto:?subject=Fwd: ${message.subject}&body=${body}`, '_blank');
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex bg-secondary h-full flex-col"
      >
        <div className="flex items-center p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={onBackClick}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Back to messages</p></TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onAction('archive', message.id)}>
                  <Archive className="h-5 w-5" />
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Archive</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onAction('trash', message.id)}>
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Move to trash</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Move to trash</p></TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="mx-1 h-6" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleReply}>
                  <Reply className="h-5 w-5" />
                  <span className="sr-only">Reply</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Reply</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleReplyAll}>
                  <ReplyAll className="h-5 w-5" />
                  <span className="sr-only">Reply all</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Reply all</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleForward}>
                  <Forward className="h-5 w-5" />
                  <span className="sr-only">Forward</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Forward</p></TooltipContent>
            </Tooltip>
          </div>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent><p>More options</p></TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction('unread', message.id)}>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('This feature is not yet implemented.')}>Star thread</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('This feature is not yet implemented.')}>Add label</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('This feature is not yet implemented.')}>Mute thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={message.sender.name} />
                <AvatarFallback>
                  {message.sender.name
                    .split(' ')
                    .map((chunk: string) => chunk[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{message.sender.name}</div>
                <div className="line-clamp-1 text-xs">{message.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span>{" "}
                  {message.sender.email}
                </div>
              </div>
            </div>
            {message.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {new Date(message.date).toLocaleDateString()}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {message.body}
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}