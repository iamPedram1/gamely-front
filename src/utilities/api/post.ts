import apiHandler from '@/utilities/api/apiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import useDocApi from '@/hooks/api/useQuery/useDoc';

// Types
import type { DataWithPagination } from '@/types/api';
import type { UseDocOptionType } from '@/hooks/api/useQuery/useDoc';
import type { PostProps, PostSummaryProps } from '@/types/blog';

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
    (id) => apiHandler.get<PostProps>(`/posts/${id}`),
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
