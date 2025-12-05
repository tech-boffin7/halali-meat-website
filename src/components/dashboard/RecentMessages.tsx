'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { memo } from 'react';

interface MessageData {
  id: string;
  name: string;
  subject: string;
  date: string;
  avatar: string;
}

interface RecentMessagesProps {
  messages: MessageData[];
}

// Memoized to prevent unnecessary re-renders when dashboard state changes
export const RecentMessages = memo(function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={message.avatar} alt="Avatar" />
                <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-xs font-medium leading-none">{message.name}</p>
                <p className="text-xs text-muted-foreground">{message.subject}</p>
              </div>
              <p className="text-xs text-muted-foreground">{message.date}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">No recent messages</p>
        )}
        <Button 
          asChild 
          variant="secondary" 
          className="w-full mt-4"
          data-tooltip="Go to inbox to read all customer messages"
          data-tooltip-position="top"
        >
          <Link href="/admin/messages">View All Messages</Link>
        </Button>
      </CardContent>
    </Card>
  );
});
