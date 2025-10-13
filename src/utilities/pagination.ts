export const initialPagination: PaginationProps = {
  currentPage: 1,
  totalPages: 1,
  limit: 30,
  hasNextPage: false,
  hasPrevPage: false,
  totalDocs: 0,
};

export type PaginationProps = {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  totalDocs: number;
  totalPages: number;
};

export default initialPagination;
