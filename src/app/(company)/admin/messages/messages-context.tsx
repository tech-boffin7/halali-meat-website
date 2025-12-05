'use client';

import { getMessageBadgeCounts, getMessagesAction, getSentMessagesAction, updateMessageStatus, updateMultipleMessageStatus } from '@/app/actions/message-actions';
import { Message, MessageType } from '@/components/messages/types';
import { ActionResponse, MessageCounts } from '@/lib/definitions';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

const MESSAGES_PER_PAGE = 10;

interface MessagesContextType {
  messages: Message[];
  messageCounts: MessageCounts;
  isLoading: boolean;
  handleSingleAction: (action: 'archive' | 'trash' | 'read' | 'unread' | 'unarchive', id: string) => Promise<void>;
  handleBulkAction: (action: 'archive' | 'trash' | 'read' | 'unread', ids: string[]) => Promise<void>;
  loadMore: () => void;
  hasMore: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  statusFilter: MessageStatusFilter;
  setStatusFilter: (filter: MessageStatusFilter) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

const calculateTotal = (counts: MessageCounts) => {
  return counts.totalInbound + counts.sent + counts.archived + counts.trash;
};

export type MessageStatusFilter = 'ALL' | 'UNREAD' | 'READ' | 'ARCHIVED' | 'TRASH' | 'SENT';

export function MessagesProvider({ children, initialMessages, initialStatusFilter }: { children: ReactNode; initialMessages?: Message[]; initialStatusFilter?: MessageStatusFilter }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [messageCounts, setMessageCounts] = useState<MessageCounts>({
    total: 0,
    totalInbound: 0,
    unread: 0,
    read: 0,
    archived: 0,
    trash: 0,
    sent: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [statusFilter, setStatusFilter] = useState<MessageStatusFilter>(initialStatusFilter || 'ALL');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined}>({
    from: undefined,
    to: undefined,
  });

  const fetchMessages = useCallback(async (pageNum: number, shouldRefresh: boolean) => {
    setIsLoading(true);
    try {
      let response: ActionResponse;
      if (statusFilter === 'SENT') {
        response = await getSentMessagesAction(pageNum, MESSAGES_PER_PAGE, sortBy, debouncedSearchQuery, undefined, dateRange.from, dateRange.to);
      } else {
        response = await getMessagesAction(pageNum, MESSAGES_PER_PAGE, statusFilter, sortBy, debouncedSearchQuery, dateRange.from, dateRange.to);
      }

      if (response.success) {
        setMessages(prev => {
          if (shouldRefresh) {
            return response.messages || [];
          }
          const newMessages = (response.messages || []).filter(
            (msg: Message) => !prev.some(pMsg => pMsg.id === msg.id)
          );
          return [...prev, ...newMessages];
        });
        setHasMore((response.messages?.length || 0) === MESSAGES_PER_PAGE);
        if (response.counts) {
          const counts = response.counts as MessageCounts;
          setMessageCounts({ ...counts, total: calculateTotal(counts) });
        }
      } else {
        toast.error(response.message || 'Failed to fetch messages.');
        setMessages([]);
        setHasMore(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
      setMessages([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, sortBy, debouncedSearchQuery, dateRange.from, dateRange.to]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchMessages(1, true);
  }, [fetchMessages]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage, false);
    }
  }, [isLoading, hasMore, page, fetchMessages]);

  const handleSingleAction = useCallback(async (action: 'archive' | 'trash' | 'read' | 'unread' | 'unarchive', id: string) => {
    let newStatus: 'READ' | 'UNREAD' | 'ARCHIVED' | 'TRASH';
    if (action === 'archive') {
      newStatus = 'ARCHIVED';
    } else if (action === 'unarchive') {
      // When unarchiving, we need to know the original type of the message
      // For simplicity, let's assume inbound messages go back to READ, and outbound to READ.
      const messageToUnarchive = messages.find(msg => msg.id === id);
      if (!messageToUnarchive) {
        toast.error('Message not found.');
        return;
      }
      newStatus = messageToUnarchive.type === MessageType.INBOUND ? 'READ' : 'READ';
    } else {
      newStatus = action.toUpperCase() as 'READ' | 'UNREAD' | 'TRASH';
    }

    let originalMessages: Message[] = [];

    setMessages(prev => {
      originalMessages = prev;
      return prev.filter(m => m.id !== id);
    });

    const result = await updateMessageStatus(id, newStatus);

    if (!result.success) {
      setMessages(originalMessages);
      toast.error(`Failed to ${action} message.`);
    } else {
      toast.success(`Message ${action}d successfully!`);
      
      const countsResponse = await getMessageBadgeCounts();
      if (countsResponse.success && countsResponse.counts) {
        setMessageCounts({ ...(countsResponse.counts as MessageCounts), total: calculateTotal(countsResponse.counts as MessageCounts) });
      }
    }
  }, [messages]);

  const handleBulkAction = useCallback(async (action: 'archive' | 'trash' | 'read' | 'unread', ids: string[]) => {
    const newStatus = (action === 'archive' ? 'ARCHIVED' : action.toUpperCase()) as 'ARCHIVED' | 'TRASH' | 'READ' | 'UNREAD';
    let originalMessages: Message[] = [];

    setMessages(prev => {
      originalMessages = prev;
      return prev.filter(m => !ids.includes(m.id));
    });

    const result = await updateMultipleMessageStatus(ids, newStatus);

    if (!result.success) {
      setMessages(originalMessages);
      toast.error(`Failed to ${action} messages.`);
    } else {
      toast.success(`Messages ${action}d successfully!`);

      const countsResponse = await getMessageBadgeCounts();
      if (countsResponse.success && countsResponse.counts) {
        setMessageCounts({ ...(countsResponse.counts as MessageCounts), total: calculateTotal(countsResponse.counts as MessageCounts) });
      }
    }
  }, []);


  const contextValue = useMemo(() => ({
    messages,
    messageCounts,
    isLoading,
    handleSingleAction,
    handleBulkAction,
    loadMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange
  }), [
    messages,
    messageCounts,
    isLoading,
    handleSingleAction,
    handleBulkAction,
    loadMore,
    hasMore,
    searchQuery,
    sortBy,
    statusFilter,
    dateRange
  ]);

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}