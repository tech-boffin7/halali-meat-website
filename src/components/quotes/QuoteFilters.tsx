import { useQuotes } from '@/app/(company)/admin/quotes/quotes-context';
import { DateRangeFilter } from '@/components/common/DateRangeFilter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortAsc, X } from 'lucide-react';

const sortOptions = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
];

const statusQuickFilters = [
  { value: 'UNREAD', label: 'Unread', color: 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30' },
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30' },
  { value: 'RESPONDED', label: 'Responded', color: 'bg-green-500/20 text-green-700 hover:bg-green-500/30' },
];

export function QuoteFilters() {
  const { dateRange, setDateRange, sortBy, setSortBy, statusFilter, setStatusFilter, searchQuery } = useQuotes();

  const hasActiveFilters = 
    dateRange.from !== undefined || 
    dateRange.to !== undefined || 
    statusFilter !== 'ALL' ||
    searchQuery !== '';

  const handleClearAll = () => {
    setDateRange({ from: undefined, to: undefined });
    setStatusFilter('ALL');
    setSortBy('createdAt_desc');
    // Note: searchQuery is cleared via navbar, not here
  };

  return (
    <div className="flex flex-col gap-3 p-3 border-b bg-muted/30">
      {/* Sort & Status Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Quick Filters */}
        <div className="flex items-center gap-1">
          {statusQuickFilters.map(filter => (
            <Badge
              key={filter.value}
              variant={statusFilter === filter.value ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                statusFilter === filter.value ? filter.color : 'hover:bg-muted'
              }`}
              onClick={() => setStatusFilter(statusFilter === filter.value ? 'ALL' : filter.value as any)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-8 text-xs ml-auto"
          >
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
    </div>
  );
}
