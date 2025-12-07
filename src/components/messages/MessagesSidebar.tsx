"use client";

import { Archive, Inbox, Package2, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MessageStatusFilter, useMessages } from '@/app/(company)/admin/messages/messages-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function MessagesSidebar() {
  const pathname = usePathname();
  const { statusFilter, setStatusFilter, messageCounts } = useMessages();

  const handleStatusFilterChange = (filter: MessageStatusFilter) => {
    setStatusFilter(filter);
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block md:sticky md:top-0">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-14 lg:h-[60px] items-center border-b px-4 lg:px-6 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-4 w-4" />
            <span className="text-sm">Messages</span>
          </Link>
        </div>

        {/* Content - calculated height with thin scrollbar */}
        <div 
          className="overflow-y-auto px-2 py-3 text-sm font-medium lg:px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-border/80 [scrollbar-width:thin]" 
          style={{ height: 'calc(100vh - 216px)' }}
        >
          <nav className="space-y-1">
            <Link
              href="/admin/messages"
              className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                pathname === '/admin/messages' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <Inbox className="h-4 w-4" />
              Inbox
              <Badge id="all-messages-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {messageCounts.totalInbound}
              </Badge>
            </Link>
            <Link
              href="/admin/messages/sent"
              className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                pathname === '/admin/messages/sent' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <Send className="h-4 w-4" />
              Drafts
              <Badge id="drafts-messages-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {messageCounts.drafts}
              </Badge>
            </Link>
            <Link
              href="/admin/messages/archived"
              className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                pathname === '/admin/messages/archived' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <Archive className="h-4 w-4" />
              Archived
              <Badge id="archived-messages-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {messageCounts.archived}
              </Badge>
            </Link>
            <Link
              href="/admin/messages/trash"
              className={`text-xs flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary ${
                pathname === '/admin/messages/trash' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Trash
              <Badge id="trash-messages-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {messageCounts.trash}
              </Badge>
            </Link>
          </nav>

          <div className="mt-6 pt-4 border-t">
            <h3 className="mb-3 px-3 text-xs font-semibold text-muted-foreground">Filter by Status</h3>
            <div className="space-y-1">
              <Button
                variant={statusFilter === 'ALL' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start capitalize text-xs h-9"
                onClick={() => handleStatusFilterChange('ALL')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'UNREAD' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start text-xs gap-2 h-9"
                onClick={() => handleStatusFilterChange('UNREAD')}
              >
                Unread
                <Badge id="unread-messages-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {messageCounts.unread}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === 'READ' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start text-xs gap-2 h-9"
                onClick={() => handleStatusFilterChange('READ')}
              >
                Read
                <Badge id="read-messages-badge" className="text-xs ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {messageCounts.read}
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
