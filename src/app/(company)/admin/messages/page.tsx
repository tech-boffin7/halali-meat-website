
import { MessagesClient } from '@/components/messages/MessagesClient';
import { getContactMessages } from '@/lib/data-access';

async function getMessages() {
    return getContactMessages();
}

export default async function AdminContactMessagesPage() {
  const messages = await getMessages();

  return <MessagesClient initialMessages={messages} />;
}
