import { Bell, Home, LineChart, Mail, Package, Package2, Settings, ShoppingCart, Users, Inbox, Send, Archive, Trash2, Tag, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/app/(company)/admin/messages/search-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function InboxSidebar() {
  const pathname = usePathname();
  const { selectedTags, toggleTag, clearTags } = useSearch();

  let tags: string[] = [];
  if (pathname === '/admin/messages/sent') {
    tags = ['customer', 'sales'];
  } else if (pathname === '/admin/messages/archived') {
    tags = ['order', 'spam'];
  } else { // Default for /admin/messages (Inbox)
    tags = ['work', 'important', 'personal'];
  }

  return (
    <TooltipProvider>
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-4 w-4" />
              <span className="text-sm">Messages</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle notifications</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/admin/messages"
                className={`text-sm flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === '/admin/messages' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <Inbox className="h-4 w-4" />
                Inbox
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  12
                </Badge>
              </Link>
              <Link
                href="/admin/messages/sent"
                className={`text-sm flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === '/admin/messages/sent' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <Send className="h-4 w-4" />
                Sent
              </Link>
              <Link
                href="/admin/messages/archived"
                className={`text-sm flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === '/admin/messages/archived' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <Archive className="h-4 w-4" />
                Archived
              </Link>
              <Link
                href="/admin/messages/trash"
                className={`text-sm flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === '/admin/messages/trash' ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Trash
              </Link>
            </nav>
            <div className="mt-4 px-2 lg:px-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground">Tags</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={clearTags}
                      disabled={selectedTags.length === 0}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Clear filters</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear tag filters</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid gap-2">
                {tags.map((tag) => (
                  <Tooltip key={tag}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedTags.includes(tag) ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start capitalize"
                        onClick={() => toggleTag(tag)}
                      >
                        <Tag className="mr-2 h-4 w-4" /> {tag}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter by {tag}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}