'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { QuoteStatus } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { Quote } from './types';

interface QuoteItemProps {
  quote: Quote;
  onSelect: () => void;
  selected: boolean;
  onToggle: () => void;
  isChecked: boolean;
  index: number;
}

const statusStyles: { [key in QuoteStatus]: string } = {
  PENDING: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
  PROCESSED: 'bg-green-500/20 text-green-700 border-green-500/30',
  RESPONDED: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  ARCHIVED: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
  TRASH: 'bg-red-500/20 text-red-700 border-red-500/30',
  READ: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
  UNREAD: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
};

// Memoized to prevent unnecessary re-renders in quote lists
export const QuoteItem = memo(function QuoteItem({ quote, selected, onSelect, onToggle, isChecked, index }: QuoteItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "flex w-full items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer",
        selected ? "bg-primary/10 border-primary/30" : "bg-card hover:bg-muted/50",
        quote.status === QuoteStatus.UNREAD ? "bg-blue-50/50 dark:bg-blue-950/20" : "border-transparent"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center h-full pt-1">
        <Checkbox checked={isChecked} onClick={(e) => { e.stopPropagation(); onToggle(); }} />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex flex-row items-center gap-2 justify-between">
            <div className="flex flex-row items-center gap-2 w-full">
              <p className="font-semibold flex flex-row items-center gap-2 text-sm truncate">
                {quote.name}
                {quote.status === QuoteStatus.UNREAD && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                )}
              </p>
            </div>
          <p className="text-[10px] text-muted-foreground text-nowrap">
            {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {quote.company && <span className="font-medium text-foreground">{quote.company}</span>}
          {quote.productInterest && <span>• {quote.productInterest}</span>}
          {quote.quantity && <span>• {quote.quantity}</span>}
        </div>
        <p className="text-xs text-muted-foreground truncate">{quote.message}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={cn("capitalize", statusStyles[quote.status])}>
            {quote.status.toLowerCase()}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
});