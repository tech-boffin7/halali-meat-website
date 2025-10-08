import { MessageItem } from './MessageItem';
import { EmptyState } from './EmptyState';

export function MessageList({ messages, selectedMessage, setSelectedMessage }: { messages: any[], selectedMessage: any, setSelectedMessage: (message: any) => void }) {
  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-2 overflow-x-auto scrollbar-thin">
      {messages.map((message, index) => (
        <MessageItem key={message.id} message={message} onSelect={() => setSelectedMessage(message)} selected={selectedMessage?.id === message.id} index={index} />
      ))}    </div>
  );
}
