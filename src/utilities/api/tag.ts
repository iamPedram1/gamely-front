import apiHandler from '@/utilities/apiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { TagProps, TagSummaryProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';

const tagsQueryKey = 'tags';

export const useTagsQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<TagProps>>('/tags'),
  [tagsQueryKey]
);

export const useTagsSummariesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<TagSummaryProps>>('/tags/summaries'),
  [tagsQueryKey]
);

export const useTagQuery = async () =>
  useAppQuery((slug) => apiHandler.get(`/tags/${slug}`), [tagsQueryKey]);

export const useCreateTag = useAppMutation(
  (payload: { title: string; coverImage: string }) =>
    apiHandler.post('/tags', payload),
  [tagsQueryKey]
);

export const useUpdateTag = useAppMutation(
  (payload: { id: string; title: string; coverImage: string }) =>
    apiHandler.patch(`/tags/${payload.id}`, payload),
  [tagsQueryKey]
);
export const useDeleteTag = useAppMutation(
  (tagId: string) => apiHandler.delete(`/tags/${tagId}`),
  [tagsQueryKey]
);
