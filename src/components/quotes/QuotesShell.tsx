'use client';

import { QuotesNavbar } from '@/components/quotes/QuotesNavbar';
import { QuotesSidebar } from '@/components/quotes/QuotesSidebar';

interface QuotesShellProps {
  children: React.ReactNode;
}

export function QuotesShell({ children }: QuotesShellProps) {
  return (
    <div className="grid min-h-screen md:h-[calc(100vh-80px)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] p-1">
      <QuotesSidebar />
      <div className="flex flex-col md:overflow-y-auto p-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <QuotesNavbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}