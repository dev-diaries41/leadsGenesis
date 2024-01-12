import React, { createContext, useState, useContext } from 'react';
import { SearchContextProps, Lead } from '../constants/types';

interface SearchProviderProps {
  children: React.ReactNode;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

const SearchProvider = ({ children}: SearchProviderProps) => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Lead[]>([]);

  return (
    <SearchContext.Provider value={{ 
        query, 
        setQuery,
        searchResults, 
        setSearchResults
     }}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearchContext = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};

export { SearchContext, SearchProvider, useSearchContext };
