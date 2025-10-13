import apiHandler from '@/utilities/api/apiHandler';
import useDocApi from '@/hooks/api/useQuery/useDoc';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { CategoryProps, SummaryProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';
import type { UseDocOptionType } from '@/hooks/api/useQuery/useDoc';

const categoriesQueryKey = 'categories';

export const useCategoriesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<CategoryProps>>('/categories'),
  [categoriesQueryKey]
);

export const useCategoriesSummariesQuery = useAppQuery(
  () => apiHandler.get<SummaryProps[]>('/categories/summaries'),
  [categoriesQueryKey]
);

export const useCategoryQuery = (options?: UseDocOptionType<CategoryProps>) =>
  useDocApi(
    (slug) => apiHandler.get<CategoryProps>(`/categories/${slug}`),
    [categoriesQueryKey],
    options
  );

export const useCreateCategory = useAppMutation(
  (payload: Omit<CategoryProps, 'id'>) =>
    apiHandler.post('/categories', payload),
  [categoriesQueryKey]
);

export const useUpdateCategory = useAppMutation(
  (payload: { id: string; title: string }) =>
    apiHandler.patch(`/categories/${payload.id}`, payload),
  [categoriesQueryKey]
);

export const useDeleteCategory = useAppMutation(
  (gameId: string) => apiHandler.delete(`/categories/${gameId}`),
  [categoriesQueryKey]
);
