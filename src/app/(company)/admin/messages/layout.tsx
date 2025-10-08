'use client';

import { useState } from 'react';
import { MessagesShell } from "@/components/messages/MessagesShell";
import { SearchProvider } from './search-context';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    console.log('Layout: handleSearch called with query:', query);
    setSearchQuery(query);
  };

  console.log('Layout: Current searchQuery:', searchQuery);

  return (
    <SearchProvider searchQuery={searchQuery} handleSearch={handleSearch}>
      <MessagesShell searchQuery={searchQuery} onSearch={handleSearch}>
        {children}
      </MessagesShell>
    </SearchProvider>
  );
}