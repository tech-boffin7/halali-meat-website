'use client';

import { useMessages } from '@/app/(company)/admin/messages/messages-context';
import { ComposeDialog } from '@/components/messages/ComposeDialog';
import { MessageList } from '@/components/messages/MessageList';
import { MessageListSkeleton } from '@/components/messages/MessageListSkeleton';
import { MessageView } from '@/components/messages/MessageView';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Archive, Download, Loader2, Mail, MailCheck, MailOpen, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Message } from './types';

import { exportMessagesToCSV } from '@/lib/export-utils';
import { toast } from 'sonner';

export function MessagesClient() {
  const { messages, handleSingleAction, handleBulkAction: handleBulkActionFromContext, isLoading, loadMore, hasMore, messageCounts, statusFilter, sortBy, searchQuery, dateRange } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedMessageIds(prev =>
      prev.includes(id) ? prev.filter(messageId => messageId !== id) : [...prev, id]
    );
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedMessageIds([]);
    setIsAllSelected(false);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedMessageIds([]);
    }
    else {
      setSelectedMessageIds(messages.map(msg => msg.id));
    }
    setIsAllSelected(prev => !prev);
  }, [isAllSelected, messages]);

  const handleBulkAction = useCallback(async (action: 'archive' | 'trash' | 'read' | 'unread') => {
    setIsBulkActionLoading(true);
    try {
      await handleBulkActionFromContext(action, selectedMessageIds);
      handleClearSelection();
    } catch (error) {
      console.error(`Failed to ${action} messages:`, error);
      toast.error(`Failed to ${action} selected messages.`);
    } finally {
      setIsBulkActionLoading(false);
    }
  }, [selectedMessageIds, handleBulkActionFromContext, handleClearSelection]);

  const handleMarkAllAsRead = useCallback(async () => {
    setIsBulkActionLoading(true);
    try {
      const unreadMessageIds = messages.filter(msg => msg.status === 'UNREAD').map(msg => msg.id);
      if (unreadMessageIds.length > 0) {
        await handleBulkActionFromContext('read', unreadMessageIds);
        toast.success('All unread messages marked as read.');
      } else {
        toast.info('No unread messages to mark as read.');
      }
    } catch (error) {
      console.error('Failed to mark all unread messages as read:', error);
      toast.error('Failed to mark all unread messages as read.');
    } finally {
      setIsBulkActionLoading(false);
    }
  }, [messages, handleBulkActionFromContext]);

  const handleExport = useCallback(async () => {
    setIsBulkActionLoading(true);
    try {
      let messagesToExport: Message[] = [];

      if (selectedMessageIds.length > 0) {
        // Export selected only
        messagesToExport = messages.filter(m => selectedMessageIds.includes(m.id));
      } else {
        // Export ALL matching current filters from server
        const { getAllMessagesForExport, getAllSentMessagesForExport } = await import('@/app/actions/message-actions');
        
        const result = statusFilter === 'DRAFTS'
          ? await getAllSentMessagesForExport(sortBy, searchQuery, undefined, dateRange.from, dateRange.to)
          : await getAllMessagesForExport(statusFilter, sortBy, searchQuery, dateRange.from, dateRange.to);
        
        if (result.success && result.messages) {
          messagesToExport = result.messages as Message[];
        } else {
          toast.error('Failed to fetch all messages for export');
          return;
        }
      }
      
      if (messagesToExport.length > 0) {
        exportMessagesToCSV(messagesToExport);
        toast.success(`Exported ${messagesToExport.length} messages to CSV`);
        handleClearSelection();
      } else {
        toast.info('No messages to export');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export messages');
    } finally {
      setIsBulkActionLoading(false);
    }
  }, [messages, selectedMessageIds, handleClearSelection, statusFilter, sortBy, searchQuery, dateRange]);

  const onBackClick = useCallback(() => setSelectedMessage(null), []);

  const folderDetails = useMemo(() => {
    switch (statusFilter) {
      case 'DRAFTS':
        return { name: 'Drafts', count: messageCounts.drafts };
      case 'ARCHIVED':
        return { name: 'Archived', count: messageCounts.archived };
      case 'TRASH':
        return { name: 'Trash', count: messageCounts.trash };
      default:
        return { name: 'Inbox', count: messageCounts.totalInbound };
    }
  }, [statusFilter, messageCounts]);

  return (
    <TooltipProvider>
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Message List Column - 40% */}
        <div className={cn('md:w-[40%] h-full max-h-full flex flex-col', selectedMessage && 'hidden md:flex')}>
          <div className="flex items-center justify-between p-2 border-b bg-background sticky top-0 z-10 shrink-0">
            {selectedMessageIds.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className="ml-2"
                  aria-label="Select all messages"
                  disabled={isBulkActionLoading}
                />
                <Button variant="ghost" onClick={handleClearSelection} disabled={isBulkActionLoading} className="text-xs">
                  Clear ({selectedMessageIds.length})
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon" onClick={() => handleBulkAction('archive')} disabled={isBulkActionLoading} data-tooltip="Archive">
                  {isBulkActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Archive className="h-5 w-5" />}
                  <span className="sr-only">Archive selected</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleBulkAction('trash')} disabled={isBulkActionLoading} data-tooltip="Trash">
                  {isBulkActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                  <span className="sr-only">Move selected to trash</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleBulkAction('read')} disabled={isBulkActionLoading} data-tooltip="Mark as Read">
                  {isBulkActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MailOpen className="h-5 w-5" />}
                  <span className="sr-only">Mark selected as read</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleBulkAction('unread')} disabled={isBulkActionLoading} data-tooltip="Mark as Unread">
                  {isBulkActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                  <span className="sr-only">Mark selected as unread</span>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon" onClick={handleExport} disabled={isBulkActionLoading} data-tooltip="Export CSV">
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Export CSV</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <div className="text-xs sm:text-xs font-medium text-muted-foreground flex-1">
                  {folderDetails.name} ({folderDetails.count})
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isBulkActionLoading}>
                      <MoreVertical className="h-5 w-5" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleMarkAllAsRead} disabled={isBulkActionLoading}>
                      <MailCheck className="mr-2 h-4 w-4" />
                      <span>Mark all as read</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExport} disabled={isBulkActionLoading}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Export all visible to CSV</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          {isLoading && messages.length === 0 ? (
            <MessageListSkeleton />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-border/80 [scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_hsl(var(--muted))]">
                <MessageList
                  messages={messages}
                  selectedMessage={selectedMessage}
                  setSelectedMessage={setSelectedMessage}
                  selectedMessageIds={selectedMessageIds}
                  onToggleSelect={handleToggleSelect}
                />
              </div>
              {hasMore && (
                <div className="p-3 border-t shrink-0">
                    <Button 
                        variant="outline" 
                        onClick={loadMore} 
                        disabled={isLoading}
                        className="w-full h-8 text-xs"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Message View Column - 60% */}
        <div className={cn('md:w-[60%] h-full flex flex-col', !selectedMessage && 'hidden md:flex')}>
          {selectedMessage ? (
            <MessageView 
              message={selectedMessage} 
              onBackClick={onBackClick} 
              onAction={handleSingleAction} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center sticky top-80 h-100vh text-muted-foreground p-8 text-center !bg-muted/40">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <Mail className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Message Selected</h3>
              <p className="text-sm max-w-sm mx-auto">
                Select a message from the list to view the conversation, reply, or manage the thread.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Compose Button */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setIsComposeOpen(true)} className="rounded-full w-12 h-12 sm:w-16 sm:h-16" data-tooltip="Compose Message">
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
      <ComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} />
    </TooltipProvider>
  );
}