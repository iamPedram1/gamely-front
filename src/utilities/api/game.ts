import apiHandler from '@/utilities/api/safeApiHandler';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { GameProps, SummaryProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';

const gamesQueryKey = 'games';

export const useGamesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<GameProps>>('/games'),
  [gamesQueryKey]
);

export const useGamesSummariesQuery = useAppQuery(
  () => apiHandler.get<SummaryProps[]>('/games/summaries'),
  [gamesQueryKey]
);

export const useGameQuery = makeUseFetchQuery(
  (slug) => apiHandler.get<GameProps>(`/games/${slug}`),
  [gamesQueryKey]
);

export const useCreateGame = useAppMutation(
  (payload: Omit<GameProps, 'id' | 'coverImage'> & { coverImage: string }) =>
    apiHandler.post('/games', payload),
  [gamesQueryKey]
);

export const useUpdateGame = useAppMutation(
  (payload: { id: string; title: string; coverImage: string }) =>
    apiHandler.patch(`/games/${payload.id}`, payload),
  [gamesQueryKey]
);

export const useDeleteGame = useAppMutation(
  (gameId: string) => apiHandler.delete(`/games/${gameId}`),
  [gamesQueryKey]
);
