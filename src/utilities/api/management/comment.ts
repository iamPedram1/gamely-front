import apiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Utilities
import endpoints from '@/utilities/endpoints';

// Types
import type { DataWithPagination } from '@/types/api';
import type { CommentProps } from '@/types/management/blog';

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
    commentId: string;
    data: Partial<Pick<CommentProps, 'status' | 'message'>>;
  }) =>
    apiHandler.patch(
      `${endpoints.management.comments}/${payload.commentId}`,
      payload.data
    ),
  [commentsQueryKey]
);

export const useDeleteComment = useAppMutation(
  (commentId: string) =>
    apiHandler.delete(`${endpoints.management.comments}/${commentId}`),
  [commentsQueryKey]
);
