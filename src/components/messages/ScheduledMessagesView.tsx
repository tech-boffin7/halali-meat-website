'use client';

import { cancelScheduledMessage, getScheduledMessages, sendScheduledMessageNow } from '@/app/actions/message-advanced-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AttachmentList } from './AttachmentList';

import { Message } from './types';


export function ScheduledMessagesView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScheduledMessages = async () => {
    setLoading(true);
    const result = await getScheduledMessages();
    if (result.success) {
      // Ensure the result matches the Message type, especially dates
      setMessages(result.messages as unknown as Message[]);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadScheduledMessages();
  }, []);

  const handleCancel = async (messageId: string) => {
    const result = await cancelScheduledMessage(messageId);
    if (result.success) {
      toast.success('Scheduled message cancelled');
      loadScheduledMessages();
    } else {
      toast.error(result.message);
    }
  };

  const handleSendNow = async (messageId: string) => {
    const result = await sendScheduledMessageNow(messageId);
    if (result.success) {
      toast.success('Message sent successfully!');
      loadScheduledMessages();
    } else {
      toast.error(result.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading scheduled messages...</div>;
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Messages</CardTitle>
          <CardDescription>No messages scheduled</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            You have no scheduled messages. Schedule a message to send it later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Scheduled Messages</h2>
        <Button variant="outline" size="sm" onClick={loadScheduledMessages}>
          Refresh
        </Button>
      </div>

      {messages.map((message) => (
        <Card key={message.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{message.subject}</CardTitle>
                <CardDescription>
                  To: {message.email}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-sm font-medium text-primary">
                  <Clock className="h-4 w-4" />
                  {message.scheduledFor ? format(new Date(message.scheduledFor), 'MMM d, yyyy h:mm a') : 'Scheduled'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {message.attachments && message.attachments.length > 0 && (
                    <span>{message.attachments.length} attachment(s)</span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none mb-4 text-muted-foreground">
               {/* Strip HTML tags for preview safety */}
               {message.body ? message.body.replace(/<[^>]*>/g, '').substring(0, 200) : ''}
               {message.body && message.body.length > 200 ? '...' : ''}
            </div>

            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-4">
                <AttachmentList attachments={message.attachments} />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleSendNow(message.id)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancel(message.id)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
