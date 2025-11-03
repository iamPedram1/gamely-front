import endpoints from '@/utilities/endpoints';
import safeApiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { usersQueryKey } from '@/utilities/api/user';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { DataWithPagination } from '@/types/api';
import type { BanRecordProps } from '@/types/management/ban';
import { AppRequestInitProps } from '@/utilities/apiHandler';

export const bansQueryKey = 'bans';

export const useBanListQuery = useAppQuery(
  (reqInit?: AppRequestInitProps) =>
    safeApiHandler.get<DataWithPagination<BanRecordProps>>(
      endpoints.management.bans,
      reqInit
    ),
  [bansQueryKey]
);

export const banUser = (payload: {
  userId: string;
  data: {
    type: 'permanent' | 'temporary';
    startAt: string;
    endAt: string | null;
  };
}) =>
  safeApiHandler.post(
    `${endpoints.management.bans}/${payload.userId}/ban`,
    payload.data
  );

export const unbanUser = (userId: string) =>
  safeApiHandler.delete(`${endpoints.management.bans}/${userId}/unban`);

export const useBanUserMutation = useAppMutation(banUser, [
  bansQueryKey,
  usersQueryKey,
]);
export const useUnbanUserMutation = useAppMutation(unbanUser, [
  bansQueryKey,
  usersQueryKey,
]);
