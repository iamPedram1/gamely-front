import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import useBaseInfiniteQuery from '@/hooks/api/useQuery/useBaseInfiniteQuery';

// Types
import type { DataWithPagination } from '@/types/api';
import type { CategoryProps } from '@/types/client/blog';
import type { UseBaseInfiniteQueryOptionsProps } from '@/hooks/api/useQuery/useBaseInfiniteQuery';

const categoriesQueryKey = 'categories';

export const useCategoriesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<CategoryProps>>('/categories'),
  [categoriesQueryKey]
);

export const useCategoryQuery = makeUseFetchQuery(
  (id, reqInit) => apiHandler.get<CategoryProps>(`/categories/${id}`, reqInit),
  [categoriesQueryKey],
  { placeholderData: { id: '', title: '', slug: '', parentId: null } }
);

export const useCategoriesInfiniteQuery = (
  options?: Partial<UseBaseInfiniteQueryOptionsProps<CategoryProps>>
) =>
  useBaseInfiniteQuery<CategoryProps>({
    enabled: true,
    initialPageParam: 1,
    queryKey: [categoriesQueryKey, 'infinitie'],
    queryFn: ({ query, pageParam }) =>
      apiHandler.get<DataWithPagination<CategoryProps>>(endpoints.categories, {
        query: { ...query, page: pageParam },
      }),
    ...options,
  });
