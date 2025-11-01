import { useAppQuery } from '@/hooks/api/useQuery';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import useBaseInfiniteQuery from '@/hooks/api/useQuery/useBaseInfiniteQuery';

// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';

// Types
import type { PostProps } from '@/types/client/blog';
import type { DataWithPagination } from '@/types/api';
import type { UseBaseInfiniteQueryOptionsProps } from '@/hooks/api/useQuery/useBaseInfiniteQuery';

const postsQueryKey = 'posts';

export const usePostsQuery = useAppQuery(
  (reqInit) =>
    apiHandler.get<DataWithPagination<PostProps>>(endpoints.posts, reqInit),
  [postsQueryKey]
);

export const usePostsInfiniteQuery = (
  options?: Partial<UseBaseInfiniteQueryOptionsProps<PostProps>>
) =>
  useBaseInfiniteQuery<PostProps>({
    initialPageParam: 1,
    queryKey: [postsQueryKey, 'infinitie'],
    queryFn: ({ query, pageParam }) =>
      apiHandler.get<DataWithPagination<PostProps>>(endpoints.posts, {
        query: { ...query, page: pageParam },
      }),
    enabled: true,
    ...options,
  });

export const usePostQuery = makeUseFetchQuery(
  (slug, reqInit) =>
    apiHandler.get<PostProps>(`${endpoints.posts}/${slug}`, {
      queryWhitelistKeyNames: ['page', 'limit', 'search'],
      ...reqInit,
    }),
  [postsQueryKey]
);
