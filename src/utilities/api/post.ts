import apiHandler from '@/utilities/api/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import useDocApi from '@/hooks/api/useQuery/useDoc';

// Types
import type { DataWithPagination } from '@/types/api';
import type { UseDocOptionType } from '@/hooks/api/useQuery/useDoc';
import type { PostProps, PostSummaryProps } from '@/types/blog';

const postsQueryKey = 'posts';

export const usePostsQuery = useAppQuery(
  (reqInit) => apiHandler.get<DataWithPagination<PostProps>>('/posts', reqInit),
  [postsQueryKey]
);

export const usePostsSummariesQuery = useAppQuery(
  (reqInit) => apiHandler.get<PostSummaryProps[]>('/posts/summaries', reqInit),
  [postsQueryKey]
);

export const usePostQuery = (options?: UseDocOptionType<PostProps>) =>
  useDocApi(
    (id, reqInit) =>
      apiHandler.get<PostProps>(`/posts/${id}`, {
        queryWhitelistKeyNames: ['page', 'limit', 'search'],
        ...reqInit,
      }),
    [postsQueryKey],
    options
  );

export const useCreatePost = useAppMutation(
  (payload: { title: string; coverImage: string }, reqInit) =>
    apiHandler.post('/posts', payload, { ...reqInit }),
  [postsQueryKey]
);

export const useUpdatePost = useAppMutation(
  (payload: { id: string; title: string; coverImage: string }, reqInit) =>
    apiHandler.patch(`/posts/${payload.id}`, payload, reqInit),
  [postsQueryKey]
);
export const useDeletePost = useAppMutation(
  (postId: string) => apiHandler.delete(`/posts/${postId}`),
  [postsQueryKey]
);
