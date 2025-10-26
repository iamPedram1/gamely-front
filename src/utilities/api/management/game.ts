import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';

// Types
import type { DataWithPagination } from '@/types/api';
import type { GameProps, SummaryProps } from '@/types/management/blog';

const gamesQueryKey = 'games';

export const useGamesQuery = useAppQuery(
  (reqInit) =>
    apiHandler.get<DataWithPagination<GameProps>>(
      endpoints.management.games,
      reqInit
    ),
  [gamesQueryKey]
);

export const useGamesSummariesQuery = useAppQuery(
  () =>
    apiHandler.get<SummaryProps[]>(`${endpoints.management.games}/summaries`),
  [gamesQueryKey, 'summaries']
);

export const useGameQuery = makeUseFetchQuery(
  (slug) => apiHandler.get<GameProps>(`${endpoints.management.games}/${slug}`),
  [gamesQueryKey]
);

export const useCreateGame = useAppMutation(
  (payload: Omit<GameProps, 'id' | 'coverImage'> & { coverImage: string }) =>
    apiHandler.post(`${endpoints.management.games}`, payload),
  [gamesQueryKey]
);

export const useUpdateGame = useAppMutation(
  (payload: { id: string; data: Partial<GameProps> }) =>
    apiHandler.patch(
      `${endpoints.management.games}/${payload.id}`,
      payload.data
    ),
  [gamesQueryKey]
);

export const useDeleteGame = useAppMutation(
  (gameId: string) =>
    apiHandler.delete(`${endpoints.management.games}/${gameId}`),
  [gamesQueryKey]
);
