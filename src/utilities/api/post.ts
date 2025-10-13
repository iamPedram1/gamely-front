import apiHandler from '@/utilities/api/apiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { DataWithPagination } from '@/types/api';
import { PostProps, PostSummaryProps } from '@/types/blog';
import useDocApi, { UseDocOptionType } from '@/hooks/api/useQuery/useDoc';

const postsQueryKey = 'posts';

export const usePostsQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<PostProps>>('/posts'),
  [postsQueryKey]
);

export const usePostsSummariesQuery = useAppQuery(
  () => apiHandler.get<PostSummaryProps[]>('/posts/summaries'),
  [postsQueryKey]
);

export const usePostQuery = (options?: UseDocOptionType<PostProps>) =>
  useDocApi(
    (slug) => apiHandler.get<PostProps>(`/posts/${slug}`),
    [postsQueryKey],
    options
  );

export const useCreatePost = useAppMutation(
  (payload: { title: string; coverImage: string }) =>
    apiHandler.post('/posts', payload),
  [postsQueryKey]
);

export const useUpdatePost = useAppMutation(
  (payload: { id: string; title: string; coverImage: string }) =>
    apiHandler.patch(`/posts/${payload.id}`, payload),
  [postsQueryKey]
);
export const useDeletePost = useAppMutation(
  (postId: string) => apiHandler.delete(`/posts/${postId}`),
  [postsQueryKey]
);
