import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';
import useBaseInfiniteQuery from '@/hooks/api/useQuery/useBaseInfiniteQuery';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import {
  useAppQuery,
  UseBaseInfiniteQueryOptionsProps,
} from '@/hooks/api/useQuery';

// Types
import type { DataWithPagination } from '@/types/api';
import type { TagProps } from '@/types/client/blog';

const tagsQueryKey = 'tags';

export const useTagsQuery = useAppQuery(
  (context) =>
    apiHandler.get<DataWithPagination<TagProps>>(endpoints.tags, {
      ...context,
      queryWhitelistKeyNames: ['page', 'limit', 'search'],
    }),
  [tagsQueryKey]
);

export const useTagQuery = makeUseFetchQuery(
  (slug, context) =>
    apiHandler.get<TagProps>(`${endpoints.tags}/${slug}`, context),
  [tagsQueryKey]
);

export const useTagsInfiniteQuery = (
  options?: Partial<UseBaseInfiniteQueryOptionsProps<TagProps>>
) =>
  useBaseInfiniteQuery<TagProps>({
    initialPageParam: 1,
    queryKey: [tagsQueryKey, 'infinitie'],
    queryFn: ({ query, pageParam }) =>
      apiHandler.get<DataWithPagination<TagProps>>(endpoints.tags, {
        query: { ...query, page: pageParam },
      }),
    enabled: true,
    ...options,
  });
