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
  (context) =>
    apiHandler.get<DataWithPagination<TagProps>>('/tags', {
      ...context,
      queryWhitelistKeyNames: ['page', 'limit', 'search'],
    }),
  [tagsQueryKey]
);

export const useTagsSummariesQuery = useAppQuery(
  (context) =>
    apiHandler.get<DataWithPagination<SummaryProps & { postsCount: number }>>(
      '/tags/summaries',
      { ...context, queryWhitelistKeyNames: ['page', 'limit', 'search'] }
    ),
  [tagsQueryKey, 'summaries']
);

export const useTagQuery = (options?: UseDocOptionType<TagProps>) =>
  useDocApi(
    (slug, context) => apiHandler.get<TagProps>(`/tags/${slug}`, context),
    [tagsQueryKey],
    options
  );

export const useCreateTag = useAppMutation(
  (payload: Pick<TagProps, 'title' | 'slug'>) =>
    apiHandler.post('/tags', payload),
  [tagsQueryKey]
);

export const useUpdateTag = useAppMutation(
  (payload: Pick<TagProps, 'id' | 'title' | 'slug'>, context) =>
    apiHandler.patch(`/tags/${payload.id}`, payload, context),
  [tagsQueryKey]
);
export const useDeleteTag = useAppMutation(
  (tagId: string) => apiHandler.delete(`/tags/${tagId}`),
  [tagsQueryKey]
);
