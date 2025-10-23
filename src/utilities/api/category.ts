import apiHandler from '@/utilities/api/safeApiHandler';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { DataWithPagination } from '@/types/api';
import type { CategoryProps, SummaryProps } from '@/types/blog';

const categoriesQueryKey = 'categories';

export const useCategoriesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<CategoryProps>>('/categories'),
  [categoriesQueryKey]
);

export const useCategoriesSummariesQuery = useAppQuery(
  () => apiHandler.get<SummaryProps[]>('/categories/summaries'),
  [categoriesQueryKey, 'summaries']
);

export const useCategoryQuery = makeUseFetchQuery(
  (id, reqInit) => apiHandler.get<CategoryProps>(`/categories/${id}`, reqInit),
  [categoriesQueryKey],
  { placeholderData: { id: '', title: '', slug: '', parentId: null } }
);

export const useCreateCategory = useAppMutation(
  (payload: Omit<CategoryProps, 'id'>) =>
    apiHandler.post('/categories', payload),
  [categoriesQueryKey]
);

export const useUpdateCategory = useAppMutation(
  (payload: CategoryProps) =>
    apiHandler.patch(`/categories/${payload.id}`, payload),
  [categoriesQueryKey]
);

export const useDeleteCategory = useAppMutation(
  (gameId: string) => apiHandler.delete(`/categories/${gameId}`),
  [categoriesQueryKey]
);
