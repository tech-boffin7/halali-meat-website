'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { MessageList } from '@/components/messages/MessageList';
import { MessageView } from '@/components/messages/MessageView';
import { cn } from '@/lib/utils';
import { useSearch } from '@/app/(company)/admin/messages/search-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TrashMessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const { searchQuery } = useSearch();
  const [trashedMessages, setTrashedMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const handleRestore = (id: string) => {
    const messageToRestore = trashedMessages.find(m => m.id === id);
    if (messageToRestore) {
      setTrashedMessages(trashedMessages.filter(m => m.id !== id));
      // In a real app, you'd move this back to the inbox
      toast.success('Message restored to inbox.');
      setSelectedMessage(null);
    }
  };

  const handlePermanentDelete = (id: string) => {
    setTrashedMessages(trashedMessages.filter(m => m.id !== id));
    toast.success('Message permanently deleted.');
    setSelectedMessage(null);
  };

  const handleEmptyTrash = () => {
    setTrashedMessages([]);
    toast.success('Trash has been emptied.');
  };

  const filteredMessages = useMemo(() => {
    return trashedMessages.filter(
      (message) =>
        message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [trashedMessages, searchQuery]);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div className={cn('md:col-span-1 h-full overflow-y-auto', selectedMessage && 'hidden md:block')}> 
          <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xs font-bold">Trash</h2>
              <Dialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="md:w-auto md:px-4" disabled={trashedMessages.length === 0}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Empty Trash</p>
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                              This action will permanently delete all messages in the trash. This cannot be undone.
                          </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                          <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button variant="destructive" onClick={handleEmptyTrash}>Yes, empty trash</Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>
          </div>
          <MessageList
            messages={filteredMessages}
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
          />
        </div>
        <div className={cn('md:col-span-2 h-full', !selectedMessage && 'hidden md:block')}> 
          {selectedMessage ? (
            <div className="flex h-full flex-col bg-secondary">
              <div className="p-4 border-b bg-destructive/10 text-destructive-foreground flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5"/>
                  <p className="text-sm font-medium">Messages in trash will be deleted forever after 30 days.</p>
              </div>
              <MessageView 
                  message={selectedMessage} 
                  onBackClick={() => setSelectedMessage(null)} 
                  onAction={(action, id) => {
                      if(action === 'trash') handlePermanentDelete(id);
                      else if (action === 'archive') handleRestore(id); // Using archive icon for restore
                      else toast.info(`Action "${action}" not applicable in trash.`);
                  }} 
              />
            </div>
          ) : (
            <div className="flex bg-secondary items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
