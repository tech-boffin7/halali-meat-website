
import { TrashMessagesClient } from '@/components/messages/TrashMessagesClient';
import { getContactMessages } from '@/lib/data-access';

async function getTrashedMessages() {
    const allMessages = await getContactMessages();
    // In a real app, you would fetch only trashed messages from the API
    return allMessages.filter((m: any) => m.status === 'trash');
}

export default async function AdminTrashMessagesPage() {
  const messages = await getTrashedMessages();

  return <TrashMessagesClient initialMessages={messages} />;
}
