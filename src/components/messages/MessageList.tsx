import { EmptyState } from './EmptyState';
import { MessageItem } from './MessageItem';
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
  selectedMessage: Message | null;
  setSelectedMessage: (message: Message) => void;
  selectedMessageIds: string[];
  onToggleSelect: (id: string) => void;
  searchQuery?: string;
}

export function MessageList({ messages, selectedMessage, setSelectedMessage, selectedMessageIds, onToggleSelect, searchQuery }: MessageListProps) {

  if (messages.length === 0) {
    return <EmptyState searchQuery={searchQuery} />;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {messages.map((message, index) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          onSelect={() => setSelectedMessage(message)} 
          selected={selectedMessage?.id === message.id} 
          onToggle={() => onToggleSelect(message.id)}
          isChecked={selectedMessageIds.includes(message.id)}
          index={index} 
        />
      ))}
    </div>
  );
}
