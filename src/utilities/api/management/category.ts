import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';

// Types
import type { DataWithPagination } from '@/types/api';
import type { CategoryProps, SummaryProps } from '@/types/management/blog';

const categoriesQueryKey = 'categories';

export const useCategoriesQuery = useAppQuery(
  () =>
    apiHandler.get<DataWithPagination<CategoryProps>>(
      endpoints.management.categories
    ),
  [categoriesQueryKey]
);

export const useCategoriesSummariesQuery = useAppQuery(
  () =>
    apiHandler.get<SummaryProps[]>(
      `${endpoints.management.categories}/summaries`
    ),
  [categoriesQueryKey, 'summaries']
);

export const useCategoryQuery = makeUseFetchQuery(
  (id, reqInit) =>
    apiHandler.get<CategoryProps>(
      `${endpoints.management.categories}/${id}`,
      reqInit
    ),
  [categoriesQueryKey],
  { placeholderData: null }
);

export const useCreateCategory = useAppMutation(
  (payload: Omit<CategoryProps, 'id'>) =>
    apiHandler.post(endpoints.management.categories, payload),
  [categoriesQueryKey]
);

export const useUpdateCategory = useAppMutation(
  (payload: { id: string; data: Partial<CategoryProps> }) =>
    apiHandler.patch(
      `${endpoints.management.categories}/${payload.id}`,
      payload.data
    ),
  [categoriesQueryKey]
);

export const useDeleteCategory = useAppMutation(
  (categoryId: string) =>
    apiHandler.delete(`${endpoints.management.categories}/${categoryId}`),
  [categoriesQueryKey]
);
