import { MessagesClient } from '@/components/messages/MessagesClient';
import { MessagesErrorBoundary } from '@/components/messages/MessagesErrorBoundary';

export default function TrashAdminContactMessagesPage() {
  return (
    <MessagesErrorBoundary>
      <MessagesClient />
    </MessagesErrorBoundary>
  );
}
