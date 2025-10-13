import apiHandler from '@/utilities/apiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { DataWithPagination } from '@/types/api';
import { PostProps, PostSummaryProps } from '@/types/blog';

const postsQueryKey = 'posts';

export const usePostsQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<PostProps>>('/posts'),
  [postsQueryKey]
);

export const usePostsSummariesQuery = useAppQuery(
  () =>
    apiHandler.get<DataWithPagination<PostSummaryProps>>('/posts/summaries'),
  [postsQueryKey]
);

export const usePostQuery = async () =>
  useAppQuery((slug) => apiHandler.get(`/posts/${slug}`), [postsQueryKey]);

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
