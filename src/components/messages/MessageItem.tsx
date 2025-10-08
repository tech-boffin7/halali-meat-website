import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


export function MessageItem({ message, onSelect, selected, index }: { message: any, onSelect: () => void, selected: boolean, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={onSelect}
      className={cn(
        'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent cursor-pointer',
        selected ? 'bg-muted' : (
          message.type === 'inbox' && !message.read ? 'bg-blue-50/50 dark:bg-blue-950/20' :
          message.type === 'sent' ? 'bg-green-50/50 dark:bg-green-950/20' :
          message.type === 'archived' ? 'bg-gray-50/50 dark:bg-gray-950/20 text-muted-foreground' :
          'bg-transparent'
        ),
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2 min-w-0">
            <div className="font-semibold text-nowrap truncate">{message.sender.name}</div>
            {message.type === 'inbox' && !message.read && (
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
            )}
          </div>
          <div className="ml-auto text-[10px] text-nowrap text-muted-foreground">
            {message.date}
          </div>
        </div>
        <div className="text-xs text-nowrap font-medium truncate">{message.subject}</div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {message.body.substring(0, 300)}
      </div>
      {message.labels.length > 0 && (
        <div className="flex items-center gap-2">
          {message.labels.map((label: string) => (
            <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
              {label}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function getBadgeVariantFromLabel(
  label: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (['work'].includes(label.toLowerCase())) {
    return 'default';
  }

  if (['personal'].includes(label.toLowerCase())) {
    return 'outline';
  }

  return 'secondary';
}
