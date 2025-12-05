'use client';

import { useMessages } from '@/app/(company)/admin/messages/messages-context'; // Import useMessages
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils'; // Import cn
import { Filter, Inbox, MailOpen, Menu, Package, Search, Trash2, X } from 'lucide-react'; // Added MailOpen and Trash2
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname

import { DateRangeFilter } from '@/components/common/DateRangeFilter';

export function MessagesNavbar() {
  const pathname = usePathname(); // Get current pathname
  const { searchQuery, setSearchQuery, sortBy, setSortBy, messageCounts, setStatusFilter, statusFilter, dateRange, setDateRange } = useMessages(); // Destructure from useMessages

  const navItems = [
    { name: 'Inbox', href: '/admin/messages', icon: Inbox, badge: messageCounts.totalInbound, filter: 'ALL' as const },
    { name: 'Sent', href: '/admin/messages/sent', icon: MailOpen, badge: messageCounts.sent, filter: 'SENT' as const },
    { name: 'Archived', href: '/admin/messages/archived', icon: Package, badge: messageCounts.archived, filter: 'ARCHIVED' as const },
    { name: 'Trash', href: '/admin/messages/trash', icon: Trash2, badge: messageCounts.trash, filter: 'TRASH' as const },
  ];

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6">
        <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden" data-tooltip="Toggle navigation menu">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="grid gap-2 text-lg font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setStatusFilter(item.filter)}
                  className={cn(
                    "mx-[-0.65rem] text-sm flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                    pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground",
                    item.name === "Inbox" && "mt-10" // Apply mt-10 only to Inbox
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {item.badge}
                  </Badge>
                </Link>
              ))}
            </nav>
            <div className="mt-4 px-2 lg:px-4">
              <h3 className="mb-2 text-xs font-semibold text-muted-foreground">
                Filter by Status
              </h3>
              <div className="grid gap-2">
                <Button
                  variant={
                    statusFilter === "ALL"
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start capitalize"
                  onClick={() => setStatusFilter("ALL")}
                >
                  All
                </Button>
                <Button
                  variant={
                    statusFilter === "UNREAD"
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start text-xs gap-2"
                  onClick={() => setStatusFilter("UNREAD")}
                >
                  Unread
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {messageCounts.unread}
                  </Badge>
                </Button>
                <Button
                  variant={
                    statusFilter === "READ"
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start text-xs gap-2"
                  onClick={() => setStatusFilter("READ")}
                >
                  Read
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {messageCounts.read}
                  </Badge>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>


        <div className="w-full flex-1 flex items-center gap-2">
          <form onSubmit={(e) => e.preventDefault()} className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="w-full appearance-none bg-background pl-8 shadow-none text-base md:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </form>
          
          {/* Mobile: Filter button that opens Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden shrink-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Open filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Filters & Sort</SheetTitle>
              <div className="flex flex-col gap-4 mt-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <SortSelect value={sortBy} onValueChange={setSortBy} />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop: Filters always visible */}
          <div className="hidden md:flex items-center gap-2">
            <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
            <SortSelect value={sortBy} onValueChange={setSortBy} />
          </div>
        </div>
      </header>
  );
}

import { memo } from 'react';

const SortSelect = memo(({ value, onValueChange }: { value: string, onValueChange: (val: string) => void }) => {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-[120px] text-xs text-nowrap">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent className="text-xs">
        <SelectItem className="text-xs" value="createdAt_desc">(Newest First)</SelectItem>
        <SelectItem className="text-xs" value="createdAt_asc">(Oldest First)</SelectItem>
        <SelectItem className="text-xs" value="name_asc">Sender (A-Z)</SelectItem>
        <SelectItem className="text-xs" value="name_desc">Sender (Z-A)</SelectItem>
      </SelectContent>
    </Select>
  );
});
SortSelect.displayName = 'SortSelect';