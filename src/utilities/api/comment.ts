import apiHandler from '@/utilities/safeApiHandler';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';

// Types
import type { CommentProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';
import initialPagination from '@/utilities/pagination';

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
  (payload: { postId: string; comment: string; replyToCommentId?: string }) =>
    apiHandler.post(`/posts/${payload.postId}/comments`, {
      comment: payload.comment,
      ...(payload.replyToCommentId && {
        replyToCommentId: payload.replyToCommentId,
      }),
    }),
  [commentsQueryKey]
);

export const useUpdateComment = useAppMutation(
  (payload: {
    postId: string;
    commentId: string;
    comment: string;
    replyToCommentId?: string;
  }) =>
    apiHandler.post(`/posts/${payload.postId}/comments/${payload.commentId}`, {
      comment: payload.comment,
      ...(payload.replyToCommentId && {
        replyToCommentId: payload.replyToCommentId,
      }),
    }),
  [commentsQueryKey]
);
