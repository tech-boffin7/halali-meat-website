'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { MessageList } from '@/components/messages/MessageList';
import { MessageView } from '@/components/messages/MessageView';
import { ComposeDialog } from '@/components/messages/ComposeDialog';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useSearch } from '@/app/(company)/admin/messages/search-context'; // Import useSearch

export function ArchivedMessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const { searchQuery, selectedTags } = useSearch(); // Get from context
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const handleAction = (action: 'archive' | 'trash' | 'unread', id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    setSelectedMessage(null);
    if (action === 'archive') {
      toast.success('Message has been un-archived.');
    } else if (action === 'trash') {
      toast.success('Message has been moved to trash.');
    } else if (action === 'unread') {
        // In a real app, you'd also update the read status
        toast.info('Message marked as unread.');
    }
  };

  const filteredMessages = useMemo(() => {
    let currentMessages = messages;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentMessages = currentMessages.filter(
        (message) =>
          message.sender.name.toLowerCase().includes(lowerCaseQuery) ||
          message.subject.toLowerCase().includes(lowerCaseQuery) ||
          message.body.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (selectedTags.length > 0) {
      currentMessages = currentMessages.filter((message) =>
        selectedTags.every((tag) => message.labels.includes(tag))
      );
    }

    return currentMessages;
  }, [messages, searchQuery, selectedTags]);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div className={cn('md:col-span-1 h-full overflow-y-auto overflow-x-auto scrollbar-thin', selectedMessage && 'hidden md:block')}>
          <MessageList
            messages={filteredMessages}
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
          />
        </div>
        <div className={cn('md:col-span-2 h-full', !selectedMessage && 'hidden md:block')}>
          {selectedMessage ? (
            <MessageView 
              message={selectedMessage} 
              onBackClick={() => setSelectedMessage(null)}
              onAction={handleAction}
            />
          ) : (
            <div className="flex bg-secondary items-center justify-center h-full text-muted-foreground">
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-6 right-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setIsComposeOpen(true)} className="rounded-full w-16 h-16">
              <Plus className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Compose new message</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <ComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} />
    </TooltipProvider>
  );
}
