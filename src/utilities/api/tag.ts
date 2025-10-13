import apiHandler from '@/utilities/api/apiHandler';
import useDocApi from '@/hooks/api/useQuery/useDoc';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { SummaryProps, TagProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';
import type { UseDocOptionType } from '@/hooks/api/useQuery/useDoc';

const tagsQueryKey = 'tags';

export const useTagsQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<TagProps>>('/tags'),
  [tagsQueryKey]
);

export const useTagsSummariesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<SummaryProps>>('/tags/summaries'),
  [tagsQueryKey, 'summaries']
);

export const useTagQuery = (options?: UseDocOptionType<TagProps>) =>
  useDocApi(
    (slug) => apiHandler.get<TagProps>(`/tags/${slug}`),
    [tagsQueryKey],
    options
  );

export const useCreateTag = useAppMutation(
  (payload: Pick<TagProps, 'title' | 'slug'>) =>
    apiHandler.post('/tags', payload),
  [tagsQueryKey]
);

export const useUpdateTag = useAppMutation(
  (payload: Pick<TagProps, 'id' | 'title' | 'slug'>) =>
    apiHandler.patch(`/tags/${payload.id}`, payload),
  [tagsQueryKey]
);
export const useDeleteTag = useAppMutation(
  (tagId: string) => apiHandler.delete(`/tags/${tagId}`),
  [tagsQueryKey]
);
