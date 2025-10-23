import type { QueryFunction } from '@tanstack/react-query';

// Custom Hooks
import useBaseQuery from './useBaseQuery';

// Custom Utilities
import initialPagination from '@/utilities/pagination';

// Custom Types
import type { CommonResponseProps } from '@/types/api';
import type { UseBaseQueryOptionsProps } from './useBaseQuery';

export const useAppQuery = <TData>(
  queryFn: QueryFunction<CommonResponseProps<TData>, readonly unknown[]>,
  queryKey: any[]
) => {
  return (
    options?: Omit<UseBaseQueryOptionsProps<TData>, 'queryFn' | 'queryKey'> & {
      queryKey?: any[];
    }
  ) => {
    return useBaseQuery({
      ...options,
      queryFn,
      placeholderData:
        options?.placeholderData ||
        ({ docs: [], pagination: initialPagination } as TData),
      queryKey: [...(queryKey || []), ...(options?.queryKey || [])],
    });
  };
};
