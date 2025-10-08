import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface QuotesNavbarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function QuotesNavbar({ searchQuery, onSearch }: QuotesNavbarProps) {
  return (
    <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quotes..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
