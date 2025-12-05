import { MessagesClient } from '@/components/messages/MessagesClient';
import { MessagesErrorBoundary } from '@/components/messages/MessagesErrorBoundary';

export default function SentAdminContactMessagesPage() {
  return (
    <MessagesErrorBoundary>
      <MessagesClient />
    </MessagesErrorBoundary>
  );
}