import { MessagesClient } from '@/components/messages/MessagesClient';
import { MessagesErrorBoundary } from '@/components/messages/MessagesErrorBoundary';

export default function AdminContactMessagesPage() {
  return (
    <MessagesErrorBoundary>
      <MessagesClient />
    </MessagesErrorBoundary>
  );
}