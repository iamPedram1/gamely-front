import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import initialPagination from '@/utilities/pagination';

// Types
import type { GameReviewProps } from '@/types/client/blog';
import type { DataWithPagination } from '@/types/api';

export const gameReviewQueryKey = 'gameReview';

export const useGameReviewsQuery = makeUseFetchQuery(
  (gameId: string) =>
    apiHandler.get<DataWithPagination<GameReviewProps>>(
      endpoints.games.reviewOf(gameId)
    ),
  [gameReviewQueryKey],
  { placeholderData: { docs: [], pagination: initialPagination } }
);

export const useAddGameReviewMutation = useAppMutation(
  (payload: {
    gameId: string;
    data: Pick<GameReviewProps, 'rate' | 'description'>;
  }) => apiHandler.post(endpoints.games.reviewOf(payload.gameId), payload.data),
  [gameReviewQueryKey]
);

export const useDeleteGameReviewMutation = useAppMutation(
  (gameId: string) => apiHandler.patch(endpoints.games.reviewOf(gameId)),
  [gameReviewQueryKey]
);
