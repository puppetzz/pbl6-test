export type PaginatedResponse<T> = {
  items: T
  page?: number
  total?: number
  totalPage?: number
  hasMore?: boolean
}
