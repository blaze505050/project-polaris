import { useMemo, useCallback, useState } from 'react';
import {
  FilterEngine,
  SortEngine,
  SearchEngine,
  QueryBuilder,
  Paginator,
  type FilterConfig,
  type SortConfig,
  type SearchConfig,
} from '@/services/advancedFilteringService';

interface UseAdvancedFilterOptions<T> {
  items: T[];
  searchFields?: string[];
  defaultPageSize?: number;
}

export function useAdvancedFilter<T extends Record<string, any>>({
  items,
  searchFields = [],
  defaultPageSize = 10,
}: UseAdvancedFilterOptions<T>) {
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [sorts, setSorts] = useState<SortConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(0);

  // Build and execute query
  const filteredItems = useMemo(() => {
    const builder = new QueryBuilder<T>();

    // Add filters
    filters.forEach((filter) => {
      builder.addFilter(filter.field, filter.operator, filter.value);
    });

    // Add search
    if (searchQuery && searchFields.length > 0) {
      builder.addSearch(searchQuery, searchFields, false);
    }

    // Add sorts
    sorts.forEach((sort) => {
      builder.addSort(sort.field, sort.direction);
    });

    return builder.execute(items);
  }, [items, filters, sorts, searchQuery, searchFields]);

  // Pagination
  const paginator = useMemo(() => {
    const p = new Paginator(filteredItems, pageSize);
    return p;
  }, [filteredItems, pageSize]);

  const currentPageItems = useMemo(() => {
    return paginator.getPage(currentPage);
  }, [paginator, currentPage]);

  // Callbacks
  const addFilter = useCallback((field: string, operator: FilterConfig['operator'], value: any) => {
    setFilters((prev) => [...prev, { field, operator, value }]);
    setCurrentPage(0);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
    setCurrentPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
    setCurrentPage(0);
  }, []);

  const addSort = useCallback((field: string, direction: 'asc' | 'desc' = 'asc') => {
    setSorts((prev) => [...prev, { field, direction }]);
  }, []);

  const removeSort = useCallback((index: number) => {
    setSorts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearSorts = useCallback(() => {
    setSorts([]);
  }, []);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  }, []);

  const nextPage = useCallback(() => {
    if (paginator.hasNextPage()) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [paginator]);

  const previousPage = useCallback(() => {
    if (paginator.hasPreviousPage()) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [paginator]);

  const goToPage = useCallback((page: number) => {
    const maxPage = paginator.getTotalPages() - 1;
    setCurrentPage(Math.max(0, Math.min(page, maxPage)));
  }, [paginator]);

  return {
    // Data
    items: currentPageItems,
    filteredItems,
    totalItems: filteredItems.length,
    
    // Filters
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    
    // Sorting
    sorts,
    addSort,
    removeSort,
    clearSorts,
    
    // Search
    searchQuery,
    search,
    
    // Pagination
    currentPage,
    pageSize,
    setPageSize,
    totalPages: paginator.getTotalPages(),
    hasNextPage: paginator.hasNextPage(),
    hasPreviousPage: paginator.hasPreviousPage(),
    nextPage,
    previousPage,
    goToPage,
  };
}
