import { useAppQuery } from '@/hooks/api/useQuery';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';

// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';

// Types
import type { PostProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';

const postsQueryKey = 'posts';

export const usePostsQuery = useAppQuery(
  (reqInit) =>
    apiHandler.get<DataWithPagination<PostProps>>(endpoints.posts, reqInit),
  [postsQueryKey]
);

export const usePostQuery = makeUseFetchQuery(
  (slug, reqInit) =>
    apiHandler.get<PostProps>(`${endpoints.posts}/${slug}`, {
      queryWhitelistKeyNames: ['page', 'limit', 'search'],
      ...reqInit,
    }),
  [postsQueryKey]
);
