'use client';

import { useQuotes } from '@/app/(company)/admin/quotes/quotes-context';
import { DateRangeFilter } from '@/components/common/DateRangeFilter';
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
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Archive, CheckCircle, Clock, FileText, Filter, Menu, MessageSquareReply, Search, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function QuotesNavbar() {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, sortBy, setSortBy, quoteCounts, setStatusFilter, dateRange, setDateRange } = useQuotes();

  const navItems = [
    { name: 'All Quotes', href: '/admin/quotes', icon: FileText, badge: quoteCounts.total, filter: 'ALL' as const },
    { name: 'Pending', href: '/admin/quotes/pending', icon: Clock, badge: quoteCounts.pending, filter: 'PENDING' as const },
    { name: 'Processed', href: '/admin/quotes/processed', icon: CheckCircle, badge: quoteCounts.processed, filter: 'PROCESSED' as const },
    { name: 'Responded', href: '/admin/quotes/responded', icon: MessageSquareReply, badge: quoteCounts.responded, filter: 'RESPONDED' as const },
    { name: 'Archived', href: '/admin/quotes/archived', icon: Archive, badge: quoteCounts.archived, filter: 'ARCHIVED' as const },
    { name: 'Trash', href: '/admin/quotes/trash', icon: Trash2, badge: quoteCounts.trash, filter: 'TRASH' as const },
  ];

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <TooltipProvider>
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
                    item.name === "All Quotes" && "mt-10"
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
          </SheetContent>
        </Sheet>

        <div className="w-full flex-1 flex items-center gap-2">
          <form onSubmit={(e) => e.preventDefault()} className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search quotes..."
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

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-2">
            <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
            <SortSelect value={sortBy} onValueChange={setSortBy} />
          </div>

          {/* Mobile Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Filters & Sort</SheetTitle>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Date Range</h4>
                  <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Sort By</h4>
                  <SortSelect value={sortBy} onValueChange={setSortBy} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </TooltipProvider>
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
