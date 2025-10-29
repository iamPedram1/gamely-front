import apiHandler from '@/utilities/safeApiHandler';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import { useAppQuery } from '@/hooks/api/useQuery';

// Types
import type { DataWithPagination } from '@/types/api';
import type { CategoryProps } from '@/types/client/blog';

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
