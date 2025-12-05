'use client';

import { getMessageThreads } from '@/app/actions/message-advanced-actions';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Mail, Paperclip } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Define a type for the thread structure expected by the component
interface Thread {
  threadId: string | null;
  firstMessage: {
    subject: string;
    name: string;
    attachments: any[];
  } | null;
  count: number;
  latestMessage: {
    body: string;
  } | null;
  latestTimestamp: Date | null;
}

interface ThreadListProps {
  onSelectThread: (threadId: string) => void;
  searchQuery?: string;
}

export function ThreadList({ onSelectThread, searchQuery }: ThreadListProps) {
  const [threads, setThreads] = useState<Thread[]>([]); // Use the defined Thread type
  const [loading, setLoading] = useState(true);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMessageThreads(1, 20, searchQuery);
      if (result.success && result.threads) {
        setThreads(result.threads);
      } else {
        toast.error('Failed to load threads');
      }
    } catch {
      toast.error('Failed to load threads');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads, searchQuery]);

  if (loading) {
    return <div className="p-8">Loading threads...</div>;
  }

  if (threads.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No conversation threads found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {threads.map((thread) => (
        <Card
          key={thread.threadId || ''}
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => thread.threadId && onSelectThread(thread.threadId)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <div className="font-medium truncate">
                    {thread.firstMessage?.subject}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {thread.firstMessage?.name} · {thread.count} message{thread.count > 1 ? 's' : ''}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {thread.latestMessage?.body.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </div>
                {(thread.firstMessage?.attachments?.length || 0) > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Paperclip className="h-3 w-3" />
                    {thread.firstMessage?.attachments?.length} attachment(s)
                  </div>
                )}
              </div>
              {thread.latestTimestamp && (
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(thread.latestTimestamp!), 'MMM d')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
