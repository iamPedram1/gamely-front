import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';

// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';

// Types
import type { DataWithPagination } from '@/types/api';
import type { PostProps, PostSummaryProps } from '@/types/management/blog';

const postsQueryKey = 'posts';

export const usePostsQuery = useAppQuery(
  (reqInit) =>
    apiHandler.get<DataWithPagination<PostProps>>(
      endpoints.management.posts,
      reqInit
    ),
  [postsQueryKey]
);

export const usePostsSummariesQuery = useAppQuery(
  (reqInit) =>
    apiHandler.get<PostSummaryProps[]>(
      `${endpoints.management.posts}/summaries`,
      reqInit
    ),
  [postsQueryKey]
);

export const usePostQuery = makeUseFetchQuery(
  (id, reqInit) =>
    apiHandler.get<PostProps>(`${endpoints.management.posts}/${id}`, {
      queryWhitelistKeyNames: ['page', 'limit', 'search'],
      ...reqInit,
    }),
  [postsQueryKey]
);

export const useCreatePost = useAppMutation(
  (payload: { title: string; coverImage: string }, reqInit) =>
    apiHandler.post(endpoints.management.posts, payload, { ...reqInit }),
  [postsQueryKey]
);

export const useUpdatePost = useAppMutation(
  (payload: { id: string; data: Partial<PostProps> }, reqInit) =>
    apiHandler.patch(
      `${endpoints.management.posts}/${payload.id}`,
      payload.data,
      reqInit
    ),
  [postsQueryKey]
);
export const useDeletePost = useAppMutation(
  (postId: string) =>
    apiHandler.delete(`${endpoints.management.posts}/${postId}`),
  [postsQueryKey]
);
