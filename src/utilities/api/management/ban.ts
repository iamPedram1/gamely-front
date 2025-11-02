import endpoints from '@/utilities/endpoints';
import safeApiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { DataWithPagination } from '@/types/api';

export const bansQueryKey = 'bans';

export const useBanListQuery = useAppQuery(
  () =>
    safeApiHandler.get<DataWithPagination<any>>(endpoints.user.profile.index),
  [bansQueryKey]
);

export const banUser = (username: string) =>
  safeApiHandler.post(endpoints.user.follow(username));

export const unbanUser = (username: string) =>
  safeApiHandler.delete(endpoints.user.unfollow(username));

export const useBanUserMutation = useAppMutation(banUser, [bansQueryKey]);
export const useUnbanUserMutation = useAppMutation(unbanUser, [bansQueryKey]);
