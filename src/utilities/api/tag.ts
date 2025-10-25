import apiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';

// Types
import type { DataWithPagination } from '@/types/api';
import type { TagProps } from '@/types/blog';

const tagsQueryKey = 'tags';

export const useTagsQuery = useAppQuery(
  (context) =>
    apiHandler.get<DataWithPagination<TagProps>>('/tags', {
      ...context,
      queryWhitelistKeyNames: ['page', 'limit', 'search'],
    }),
  [tagsQueryKey]
);

export const useTagQuery = makeUseFetchQuery(
  (slug, context) => apiHandler.get<TagProps>(`/tags/${slug}`, context),
  [tagsQueryKey]
);
