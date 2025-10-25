import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';

// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';

// Types
import type { DataWithPagination } from '@/types/api';
import type { SummaryProps, TagProps } from '@/types/blog';

const tagsQueryKey = 'tags';

export const useTagsQuery = useAppQuery(
  (context) =>
    apiHandler.get<DataWithPagination<TagProps>>(endpoints.management.tags, {
      ...context,
      queryWhitelistKeyNames: ['page', 'limit', 'search'],
    }),
  [tagsQueryKey]
);

export const useTagsSummariesQuery = useAppQuery(
  (context) =>
    apiHandler.get<(SummaryProps & { postsCount: number })[]>(
      `${endpoints.management.tags}/summaries`,
      {
        ...context,
        queryWhitelistKeyNames: ['page', 'limit', 'search'],
      }
    ),
  [tagsQueryKey, 'summaries']
);

export const useTagQuery = makeUseFetchQuery(
  (slug, context) =>
    apiHandler.get<TagProps>(`${endpoints.management.tags}/${slug}`, context),
  [tagsQueryKey]
);

export const useCreateTag = useAppMutation(
  (payload: Pick<TagProps, 'title' | 'slug'>) =>
    apiHandler.post(endpoints.management.tags, payload),
  [tagsQueryKey]
);

export const useUpdateTag = useAppMutation(
  (payload: Pick<TagProps, 'id' | 'title' | 'slug'>, context) =>
    apiHandler.patch(
      `${endpoints.management.tags}/${payload.id}`,
      payload,
      context
    ),
  [tagsQueryKey]
);
export const useDeleteTag = useAppMutation(
  (tagId: string) => apiHandler.delete(`${endpoints.management.tags}/${tagId}`),
  [tagsQueryKey]
);
