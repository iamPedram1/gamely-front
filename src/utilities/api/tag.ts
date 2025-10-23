import apiHandler from '@/utilities/api/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';

// Types
import type { DataWithPagination } from '@/types/api';
import type { SummaryProps, TagProps } from '@/types/blog';

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
    apiHandler.get<(SummaryProps & { postsCount: number })[]>(
      '/tags/summaries',
      {
        ...context,
        queryWhitelistKeyNames: ['page', 'limit', 'search'],
      }
    ),
  [tagsQueryKey, 'summaries']
);

export const useTagQuery = makeUseFetchQuery(
  (slug, context) => apiHandler.get<TagProps>(`/tags/${slug}`, context),
  [tagsQueryKey]
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
