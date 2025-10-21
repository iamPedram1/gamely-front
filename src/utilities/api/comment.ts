import apiHandler from '@/utilities/api/safeApiHandler';
import useDocApi from '@/hooks/api/useQuery/useDoc';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { CommentProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';
import type { UseDocOptionType } from '@/hooks/api/useQuery/useDoc';

const commentsQueryKey = 'comments';

export const useCommentsQuery = (
  options?: UseDocOptionType<DataWithPagination<CommentProps>>
) =>
  useDocApi(
    (postId) =>
      apiHandler.get<DataWithPagination<CommentProps>>(
        `/posts/${postId}/comments`
      ),
    [commentsQueryKey],
    options
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
