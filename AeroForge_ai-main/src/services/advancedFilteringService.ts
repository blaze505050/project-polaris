/**
 * Advanced Filtering Service
 * Provides sophisticated filtering, sorting, and search capabilities
 */

export interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';
  value: any;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchConfig {
  query: string;
  fields: string[];
  caseSensitive?: boolean;
  fuzzy?: boolean;
}

/**
 * Advanced Filter Engine
 */
export class FilterEngine {
  /**
   * Apply filters to items
   */
  static filter<T extends Record<string, any>>(
    items: T[],
    filters: FilterConfig[]
  ): T[] {
    if (filters.length === 0) return items;

    return items.filter((item) => {
      return filters.every((filter) => this.matchesFilter(item, filter));
    });
  }

  /**
   * Check if item matches a single filter
   */
  private static matchesFilter<T extends Record<string, any>>(
    item: T,
    filter: FilterConfig
  ): boolean {
    const value = this.getNestedValue(item, filter.field);

    switch (filter.operator) {
      case 'equals':
        return value === filter.value;
      case 'contains':
        return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
      case 'startsWith':
        return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
      case 'endsWith':
        return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
      case 'gt':
        return Number(value) > Number(filter.value);
      case 'lt':
        return Number(value) < Number(filter.value);
      case 'gte':
        return Number(value) >= Number(filter.value);
      case 'lte':
        return Number(value) <= Number(filter.value);
      case 'in':
        return Array.isArray(filter.value) && filter.value.includes(value);
      case 'between':
        return (
          Array.isArray(filter.value) &&
          Number(value) >= Number(filter.value[0]) &&
          Number(value) <= Number(filter.value[1])
        );
      default:
        return true;
    }
  }

  /**
   * Get nested object value by dot notation
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}

/**
 * Advanced Sort Engine
 */
export class SortEngine {
  /**
   * Sort items by multiple criteria
   */
  static sort<T extends Record<string, any>>(
    items: T[],
    sortConfigs: SortConfig[]
  ): T[] {
    if (sortConfigs.length === 0) return items;

    return [...items].sort((a, b) => {
      for (const config of sortConfigs) {
        const aValue = this.getNestedValue(a, config.field);
        const bValue = this.getNestedValue(b, config.field);

        const comparison = this.compare(aValue, bValue);
        if (comparison !== 0) {
          return config.direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }

  /**
   * Compare two values
   */
  private static compare(a: any, b: any): number {
    if (a === b) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    const aStr = String(a).toLowerCase();
    const bStr = String(b).toLowerCase();
    return aStr.localeCompare(bStr);
  }

  /**
   * Get nested object value by dot notation
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}

/**
 * Advanced Search Engine with fuzzy matching
 */
export class SearchEngine {
  /**
   * Search items with optional fuzzy matching
   */
  static search<T extends Record<string, any>>(
    items: T[],
    config: SearchConfig
  ): T[] {
    const { query, fields, caseSensitive = false, fuzzy = false } = config;

    if (!query) return items;

    const searchQuery = caseSensitive ? query : query.toLowerCase();

    return items.filter((item) => {
      return fields.some((field) => {
        const value = this.getNestedValue(item, field);
        const stringValue = caseSensitive ? String(value) : String(value).toLowerCase();

        if (fuzzy) {
          return this.fuzzyMatch(stringValue, searchQuery);
        } else {
          return stringValue.includes(searchQuery);
        }
      });
    });
  }

  /**
   * Fuzzy matching algorithm
   */
  private static fuzzyMatch(str: string, pattern: string): boolean {
    let patternIdx = 0;
    for (let i = 0; i < str.length && patternIdx < pattern.length; i++) {
      if (str[i] === pattern[patternIdx]) {
        patternIdx++;
      }
    }
    return patternIdx === pattern.length;
  }

  /**
   * Calculate fuzzy match score (0-1)
   */
  static fuzzyScore(str: string, pattern: string): number {
    let score = 0;
    let patternIdx = 0;

    for (let i = 0; i < str.length && patternIdx < pattern.length; i++) {
      if (str[i] === pattern[patternIdx]) {
        score += 1;
        patternIdx++;
      }
    }

    if (patternIdx !== pattern.length) return 0;
    return score / str.length;
  }

  /**
   * Get nested object value by dot notation
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}

/**
 * Faceted Search Engine
 */
export class FacetedSearchEngine {
  /**
   * Generate facets from items
   */
  static generateFacets<T extends Record<string, any>>(
    items: T[],
    facetFields: string[]
  ): Record<string, { value: string; count: number }[]> {
    const facets: Record<string, Map<string, number>> = {};

    facetFields.forEach((field) => {
      facets[field] = new Map();
    });

    items.forEach((item) => {
      facetFields.forEach((field) => {
        const value = this.getNestedValue(item, field);
        if (value != null) {
          const key = String(value);
          facets[field].set(key, (facets[field].get(key) || 0) + 1);
        }
      });
    });

    const result: Record<string, { value: string; count: number }[]> = {};
    Object.entries(facets).forEach(([field, map]) => {
      result[field] = Array.from(map.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);
    });

    return result;
  }

  /**
   * Get nested object value by dot notation
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}

/**
 * Query Builder for complex filtering
 */
export class QueryBuilder<T extends Record<string, any>> {
  private filters: FilterConfig[] = [];
  private sorts: SortConfig[] = [];
  private searchConfig: SearchConfig | null = null;

  addFilter(field: string, operator: FilterConfig['operator'], value: any): this {
    this.filters.push({ field, operator, value });
    return this;
  }

  addSort(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.sorts.push({ field, direction });
    return this;
  }

  addSearch(query: string, fields: string[], fuzzy = false): this {
    this.searchConfig = { query, fields, fuzzy };
    return this;
  }

  execute(items: T[]): T[] {
    let result = items;

    // Apply search first
    if (this.searchConfig) {
      result = SearchEngine.search(result, this.searchConfig);
    }

    // Apply filters
    if (this.filters.length > 0) {
      result = FilterEngine.filter(result, this.filters);
    }

    // Apply sorting
    if (this.sorts.length > 0) {
      result = SortEngine.sort(result, this.sorts);
    }

    return result;
  }

  reset(): this {
    this.filters = [];
    this.sorts = [];
    this.searchConfig = null;
    return this;
  }
}

/**
 * Pagination helper
 */
export class Paginator<T> {
  private items: T[];
  private pageSize: number;
  private currentPage: number;

  constructor(items: T[], pageSize: number = 10) {
    this.items = items;
    this.pageSize = pageSize;
    this.currentPage = 0;
  }

  getPage(page: number): T[] {
    const start = page * this.pageSize;
    const end = start + this.pageSize;
    return this.items.slice(start, end);
  }

  getCurrentPage(): T[] {
    return this.getPage(this.currentPage);
  }

  nextPage(): T[] {
    if (this.hasNextPage()) {
      this.currentPage++;
    }
    return this.getCurrentPage();
  }

  previousPage(): T[] {
    if (this.hasPreviousPage()) {
      this.currentPage--;
    }
    return this.getCurrentPage();
  }

  hasNextPage(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.items.length;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  getTotalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }

  getCurrentPageNumber(): number {
    return this.currentPage + 1;
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
  }

  updateItems(items: T[]): void {
    this.items = items;
    this.currentPage = 0;
  }
}
