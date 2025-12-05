'use client';

import { MessagesProvider } from '@/app/(company)/admin/messages/messages-context';
import { MessagesClient } from './MessagesClient';
import { Message } from './types';

interface MessagesClientWrapperProps {
  initialMessages: Message[];
}

export function MessagesClientWrapper({
  initialMessages,
}: MessagesClientWrapperProps) {
  return (
    <MessagesProvider
      initialMessages={initialMessages}
    >
      <MessagesClient />
    </MessagesProvider>
  );
}
