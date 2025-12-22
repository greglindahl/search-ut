import { useState, useCallback, useEffect } from "react";
import { mockLibraryAssets, searchAssets, LibraryAsset, SearchFilters } from "@/lib/mockLibraryData";

interface Facet {
  field: string;
  value: string;
  label: string;
}

interface UseLibrarySearchResult {
  results: LibraryAsset[];
  isLoading: boolean;
  totalCount: number;
  search: (query: string, facets: Facet[]) => void;
}

// Simulated API delay (200-600ms)
const SIMULATED_DELAY_MIN = 200;
const SIMULATED_DELAY_MAX = 600;

function getRandomDelay(): number {
  return Math.floor(Math.random() * (SIMULATED_DELAY_MAX - SIMULATED_DELAY_MIN + 1)) + SIMULATED_DELAY_MIN;
}

// Convert facets array to SearchFilters object
function facetsToFilters(query: string, facets: Facet[]): SearchFilters {
  const filters: SearchFilters = { query };

  facets.forEach((facet) => {
    switch (facet.field) {
      case "creator":
        filters.creator = [...(filters.creator || []), facet.value];
        break;
      case "type":
        filters.type = [...(filters.type || []), facet.value];
        break;
      case "date":
        filters.date = facet.value;
        break;
      case "aspect":
        filters.aspect = [...(filters.aspect || []), facet.value];
        break;
      case "status":
        filters.status = [...(filters.status || []), facet.value];
        break;
      case "tag":
        filters.tag = [...(filters.tag || []), facet.value];
        break;
    }
  });

  return filters;
}

export function useLibrarySearch(): UseLibrarySearchResult {
  const [results, setResults] = useState<LibraryAsset[]>(mockLibraryAssets);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(mockLibraryAssets.length);

  // Initial load
  useEffect(() => {
    setResults(mockLibraryAssets);
    setTotalCount(mockLibraryAssets.length);
  }, []);

  const search = useCallback((query: string, facets: Facet[]) => {
    setIsLoading(true);

    // Simulate API delay
    const delay = getRandomDelay();
    
    setTimeout(() => {
      const filters = facetsToFilters(query, facets);
      const searchResults = searchAssets(mockLibraryAssets, filters);
      
      // Sort by date (newest first)
      searchResults.sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime());
      
      setResults(searchResults);
      setTotalCount(searchResults.length);
      setIsLoading(false);
    }, delay);
  }, []);

  return { results, isLoading, totalCount, search };
}
