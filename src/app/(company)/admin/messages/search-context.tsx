'use client';

import { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchQuery: string;
  handleSearch: (query: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export function SearchProvider({
  children,
  searchQuery,
  handleSearch,
}: {
  children: React.ReactNode;
  searchQuery: string;
  handleSearch: (query: string) => void;
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, handleSearch, selectedTags, toggleTag, clearTags }}>
      {children}
    </SearchContext.Provider>
  );
}
