import type { PaginationProps } from '@/utilities/pagination';

export interface CommonResponseProps<T> {
  data?: T;
  errors: string[];
  message: string;
  isSuccess: boolean;
  statusCode: number;
}

export interface DataWithPagination<T> {
  docs: T[];
  pagination: PaginationProps;
}

export type IFileLocation = 'game' | 'post' | 'user';

export interface FileProps {
  id: string;
  location: IFileLocation;
  filename: string;
  size: number;
  mimetype: string;
  url: string;
  createDate: string;
  updateDate: string;
}
