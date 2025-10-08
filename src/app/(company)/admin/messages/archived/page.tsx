
import { ArchivedMessagesClient } from '@/components/messages/ArchivedMessagesClient';
import { getContactMessages } from '@/lib/data-access';

async function getArchivedMessages() {
    const allMessages = await getContactMessages();
    // In a real app, you would fetch only archived messages from the API
    return allMessages.filter((m: any) => m.status === 'archived');
}

export default async function AdminArchivedMessagesPage() {
  const messages = await getArchivedMessages();

  return <ArchivedMessagesClient initialMessages={messages} />;
}
