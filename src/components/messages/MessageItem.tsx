import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { Message } from './types';

interface MessageItemProps {
  message: Message;
  onSelect: () => void;
  selected: boolean;
  onToggle: (id: string) => void;
  isChecked: boolean;
  index: number;
}

// Memoized to prevent unnecessary re-renders in message lists
export const MessageItem = memo(function MessageItem({ message, onSelect, selected, onToggle, isChecked, index }: MessageItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-2 text-left text-sm transition-all hover:bg-accent cursor-pointer',
        selected || isChecked ? 'bg-muted' : message.status === 'UNREAD' ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'bg-transparent',
      )}
    >
      <Checkbox checked={isChecked} onCheckedChange={() => onToggle(message.id)} className="mt-1" aria-label={`Select message from ${message.name} with subject ${message.subject}`} />
      <div onClick={onSelect} className="flex-1">
        <div className="flex w-full flex-col gap-1">
          <div className="flex flex-wrap items-center">
            <div className="flex items-center gap-2 min-w-0">
              <div className="font-semibold truncate">{message.name}</div>
              {message.status === 'UNREAD' && (
                <span className="flex h-2 w-2 mx-2 rounded-full bg-blue-600" />
              )}
            </div>
            <div className="ml-2 sm:ml-0 text-[10px] text-nowrap text-muted-foreground">
              {format(new Date(message.createdAt), "PPpp")}
            </div>
          </div>
          <div className="text-xs font-medium truncate">{message.subject}</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          {message.body.substring(0, 300)}
        </div>
      </div>
    </motion.div>
  );
});
