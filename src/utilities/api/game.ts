import apiHandler from '@/utilities/apiHandler';
import useDocApi from '@/hooks/api/useQuery/useDoc';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { GameProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';
import type { UseDocOptionType } from '@/hooks/api/useQuery/useDoc';

const gamesQueryKey = 'games';

export const useGamesQuery = useAppQuery(
  () => apiHandler.get<DataWithPagination<GameProps>>('/games'),
  [gamesQueryKey]
);

export const useGameQuery = (options?: UseDocOptionType<GameProps>) =>
  useDocApi(
    (slug) => apiHandler.get<GameProps>(`/games/${slug}`),
    [gamesQueryKey],
    options
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
