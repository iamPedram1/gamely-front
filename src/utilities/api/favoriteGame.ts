import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import { gamesQueryKey } from '@/utilities/api/game';
import initialPagination from '@/utilities/pagination';

// Types
import type { GameProps } from '@/types/client/blog';
import type { DataWithPagination } from '@/types/api';

export const favoriteGamesQueryKey = 'favoriteGames';

export const useFavoriteGamesQuery = makeUseFetchQuery(
  (username: string) =>
    apiHandler.get<DataWithPagination<GameProps>>(
      endpoints.favoriteGames.ofUser(username)
    ),
  [favoriteGamesQueryKey],
  { placeholderData: { docs: [], pagination: initialPagination } }
);

export const useRateGameMutation = useAppMutation(
  ({ gameId, rating }: { gameId: string; rating: number }) =>
    apiHandler.post(`${endpoints.games}/${gameId}/rate`, { rating }),
  [gamesQueryKey]
);

export const useAddGameToFavoriteMutation = useAppMutation(
  (gameId: string) => apiHandler.post(endpoints.favoriteGames.favorite(gameId)),
  [favoriteGamesQueryKey]
);

export const useRemoveGameFromFavoriteMutation = useAppMutation(
  (gameId: string) =>
    apiHandler.delete(endpoints.favoriteGames.favorite(gameId)),
  [favoriteGamesQueryKey]
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
