import { QuotesSidebar } from './QuotesSidebar';
import { QuotesNavbar } from './QuotesNavbar'; // Using QuotesNavbar for search input

interface QuotesShellProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function QuotesShell({ children, searchQuery, onSearch }: QuotesShellProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-x-auto scrollbar-thin">
      <QuotesSidebar />
      <div className="flex flex-col">
        <QuotesNavbar searchQuery={searchQuery} onSearch={onSearch} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
