import useBaseInfiniteQuery from '@/hooks/api/useQuery/useBaseInfiniteQuery';

// Utilities
import apiHandler from '@/utilities/safeApiHandler';
import endpoints from '@/utilities/endpoints';

// Types
import type { DataWithPagination } from '@/types/api';
import type { BanRecordProps } from '@/types/management/ban';
import type { UseBaseInfiniteQueryOptionsProps } from '@/hooks/api/useQuery/useBaseInfiniteQuery';

const bansQueryKey = 'bans';

export const useBansInfiniteQuery = (
  options?: Partial<UseBaseInfiniteQueryOptionsProps<BanRecordProps>>
) =>
  useBaseInfiniteQuery<BanRecordProps>({
    initialPageParam: 1,
    queryKey: [bansQueryKey],
    queryFn: ({ pageParam }) =>
      apiHandler.get<DataWithPagination<BanRecordProps>>(
        endpoints.management.bans,
        { query: { page: pageParam } }
      ),
    enabled: true,
    ...options,
  });
