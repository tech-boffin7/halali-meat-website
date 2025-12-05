'use client';

import { getThreadMessages } from '@/app/actions/message-advanced-actions';
import { AttachmentList } from '@/components/messages/AttachmentList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Attachment, Message } from '@prisma/client';
import { format } from 'date-fns';
import { Mail, Reply, User } from 'lucide-react';
import { useEffect, useState } from 'react';

type MessageWithAttachments = Message & {
  attachments: Attachment[];
};

interface ThreadViewProps {
  threadId: string;
  onClose: () => void;
  onReply?: (message: Message) => void;
}

export function ThreadView({ threadId, onClose, onReply }: ThreadViewProps) {
  const [messages, setMessages] = useState<MessageWithAttachments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThread = async () => {
      setLoading(true);
      const result = await getThreadMessages(threadId);
      if (result.success) {
        setMessages(result.messages);
      }
      setLoading(false);
    };
    
    loadThread();
  }, [threadId]);

  if (loading) {
    return <div className="p-8">Loading thread...</div>;
  }

  if (messages.length === 0) {
    return <div className="p-8">No messages in this thread</div>;
  }

  const firstMessage = messages[0];

  return (
    <div className="space-y-4">
      {/* Thread Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{firstMessage.subject}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                {messages.length} message{messages.length > 1 ? 's' : ''} in this conversation
              </div>
            </div>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Close Thread
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Thread Messages */}
      {messages.map((message, index) => (
        <Card 
          key={message.id}
          className={`${message.type === 'OUTBOUND' ? 'bg-primary/5' : ''} ${index > 0 ? 'ml-8' : ''}`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {message.type === 'INBOUND' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Mail className="h-4 w-4 text-primary" />
                )}
                <div>
                  <div className="font-medium">{message.name}</div>
                  <div className="text-sm text-muted-foreground">{message.email}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: message.body }}
            />

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-4">
                <AttachmentList attachments={message.attachments} />
              </div>
            )}

            {message.type === 'INBOUND' && onReply && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onReply(message)}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
