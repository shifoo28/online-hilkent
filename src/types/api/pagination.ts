/**
 * Pagination Types
 * Type-safe pagination helpers and interfaces
 */

/**
 * Pagination Parameters
 * Common pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/**
 * Pagination Metadata
 * Standard pagination response metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated Result
 * Generic paginated response structure
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Create pagination meta
 * Helper to construct pagination metadata
 */
export function createPaginationMeta(
  page: number,
  pageSize: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Validate pagination params
 * Ensure pagination params are within valid ranges
 */
export function validatePaginationParams(
  page?: number,
  pageSize?: number,
): { page: number; pageSize: number } {
  const validPage = Math.max(1, page ?? 1);
  const validPageSize = Math.min(Math.max(1, pageSize ?? 10), 100); // Max 100 items per page
  return { page: validPage, pageSize: validPageSize };
}

/**
 * Calculate offset from pagination params
 */
export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Get pagination query string
 */
export function getPaginationQuery(
  page: number,
  pageSize: number,
  additional?: Record<string, any>,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("pageSize", pageSize.toString());

  if (additional) {
    Object.entries(additional).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
  }

  return params;
}

/**
 * Default pagination size constants
 */
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;
export const MAX_PAGE_SIZE = 100;
