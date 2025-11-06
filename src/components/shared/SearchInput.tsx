'use client';

import { useState, useEffect } from 'react'; 
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => { 
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]); 

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}