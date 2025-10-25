import apiHandler from '@/utilities/safeApiHandler';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import { useAppQuery } from '@/hooks/api/useQuery';

// Types
import type { GameProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';

const gamesQueryKey = 'games';

export const useGamesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<GameProps>>('/games'),
  [gamesQueryKey]
);

export const useGameQuery = makeUseFetchQuery(
  (slug) => apiHandler.get<GameProps>(`/games/${slug}`),
  [gamesQueryKey]
);
