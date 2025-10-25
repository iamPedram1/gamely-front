import apiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Utilities
import endpoints from '@/utilities/endpoints';

// Types
import type { CommentProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';

const commentsQueryKey = 'comments';

export const useCommentsQuery = useAppQuery(
  (reqInit) =>
    apiHandler.get<DataWithPagination<CommentProps>>(
      endpoints.management.comments,
      reqInit
    ),
  [commentsQueryKey]
);

export const useUpdateComment = useAppMutation(
  (payload: {
    postId: string;
    commentId: string;
    comment: string;
    replyToCommentId?: string;
  }) =>
    apiHandler.post(`${endpoints.management.comments}/${payload.commentId}`, {
      comment: payload.comment,
      ...(payload.replyToCommentId && {
        replyToCommentId: payload.replyToCommentId,
      }),
    }),
  [commentsQueryKey]
);
