'use client';

import { usePathname } from 'next/navigation'; // Import usePathname
import { Menu, Search, Inbox, Package } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet, SheetContent, SheetTrigger, SheetTitle
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; // Import cn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface InboxNavbarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function InboxNavbar({ searchQuery, onSearch }: InboxNavbarProps) {
  const pathname = usePathname(); // Get current pathname

  return (
    <TooltipProvider>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle navigation menu</p>
            </TooltipContent>
          </Tooltip>
          <SheetContent side="left" className="flex flex-col">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/admin/messages"
                className={cn(
                  "mx-[-0.65rem] text-sm mt-10 flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                  pathname === "/admin/messages" ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                <Inbox className="h-5 w-5" />
                Inbox
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  12
                </Badge>
              </Link>
              <Link
                href="/admin/messages/sent"
                className={cn(
                  "mx-[-0.65rem] text-sm flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                  pathname === "/admin/messages/sent" ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                <Inbox className="h-5 w-5" />
                Sent
              </Link>
              <Link
                href="/admin/messages/archived"
                className={cn(
                  "mx-[-0.65rem] text-sm flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                  pathname === "/admin/messages/archived" ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                <Package className="h-5 w-5" />
                Archive
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="w-full flex-1">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </form>
        </div>
      </header>
    </TooltipProvider>
  );
}
