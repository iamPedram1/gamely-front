import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';
import useBaseInfiniteQuery from '@/hooks/api/useQuery/useBaseInfiniteQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import {
  useAppQuery,
  UseBaseInfiniteQueryOptionsProps,
} from '@/hooks/api/useQuery';

// Types
import type { GameProps } from '@/types/client/blog';
import type { DataWithPagination } from '@/types/api';

export const gamesQueryKey = 'games';

export const useGamesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<GameProps>>(endpoints.games),
  [gamesQueryKey]
);

export const useGameQuery = makeUseFetchQuery(
  (slug) => apiHandler.get<GameProps>(`${endpoints.games}/${slug}`),
  [gamesQueryKey]
);

export const useGamesInfiniteQuery = (
  options?: Partial<UseBaseInfiniteQueryOptionsProps<GameProps>>
) =>
  useBaseInfiniteQuery<GameProps>({
    initialPageParam: 1,
    queryKey: [gamesQueryKey, 'infinite'],
    queryFn: ({ query, pageParam }) =>
      apiHandler.get<DataWithPagination<GameProps>>(endpoints.games, {
        query: { ...query, page: pageParam },
      }),
    enabled: true,
    ...options,
  });

export const useRateGameMutation = useAppMutation(
  ({ gameId, rating }: { gameId: string; rating: number }) =>
    apiHandler.post(`${endpoints.games}/${gameId}/rate`, { rating }),
  [gamesQueryKey]
);

export const useToggleFavoriteMutation = useAppMutation(
  (gameId: string) => apiHandler.post(`${endpoints.games}/${gameId}/favorite`),
  [gamesQueryKey]
);

export const useGameRatingQuery = makeUseFetchQuery(
  (gameId: string) => apiHandler.get(`${endpoints.games}/${gameId}/rating`),
  [gamesQueryKey, 'rating']
);

export const useGameFavoriteStatusQuery = makeUseFetchQuery(
  (gameId: string) =>
    apiHandler.get(`${endpoints.games}/${gameId}/favorite-status`),
  [gamesQueryKey, 'favorite']
);
