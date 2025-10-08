
import { SentMessagesClient } from '@/components/messages/SentMessagesClient';
import { getContactMessages } from '@/lib/data-access';

async function getSentMessages() {
    const allMessages = await getContactMessages();
    // In a real app, you would fetch only sent messages from the API
    return allMessages.filter((m: any) => m.type === 'sent');
}

export default async function AdminSentMessagesPage() {
  const messages = await getSentMessages();

  return <SentMessagesClient initialMessages={messages} />;
}
