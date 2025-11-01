import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';

// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';
import initialPagination from '@/utilities/pagination';

// Types
import type { CommentProps } from '@/types/client/blog';
import type { DataWithPagination } from '@/types/api';

const commentsQueryKey = 'comments';

export const useCommentsQuery = makeUseFetchQuery(
  (postId) =>
    apiHandler.get<DataWithPagination<CommentProps>>(
      `/posts/${postId}/comments`
    ),
  [commentsQueryKey],
  { placeholderData: { docs: [], pagination: initialPagination } }
);

export const useCreateComment = useAppMutation(
  (payload: { postId: string; message: string; replyToComment?: string }) =>
    apiHandler.post(`${endpoints.posts}/${payload.postId}/comments`, {
      message: payload.message,
      ...(payload.replyToComment && {
        replyToComment: payload.replyToComment,
      }),
    }),
  [commentsQueryKey]
);

export const useUpdateComment = useAppMutation(
  (payload: {
    postId: string;
    commentId: string;
    message: string;
    replyToComment?: string;
  }) =>
    apiHandler.post(
      `${endpoints.posts}/${payload.postId}/comments/${payload.commentId}`,
      {
        message: payload.message,
        ...(payload.replyToComment && {
          replyToComment: payload.replyToComment,
        }),
      }
    ),
  [commentsQueryKey]
);
