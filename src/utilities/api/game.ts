import apiHandler from '@/utilities/safeApiHandler';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import { useAppQuery } from '@/hooks/api/useQuery';

// Types
import type { GameProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';
import endpoints from '@/utilities/endpoints';

const gamesQueryKey = 'games';

export const useGamesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<GameProps>>(endpoints.games),
  [gamesQueryKey]
);

export const useGameQuery = makeUseFetchQuery(
  (slug) => apiHandler.get<GameProps>(`${endpoints.games}/${slug}`),
  [gamesQueryKey]
);
