export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  total_pages: number;
}
