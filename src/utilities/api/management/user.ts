import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';

// Utilities
import apiHandler from '@/utilities/safeApiHandler';
import endpoints from '@/utilities/endpoints';

// Types
import type { UserProps } from '@/types/client/blog';
import type { DataWithPagination } from '@/types/api';

const usersQueryKey = 'users';

export const useUsersQuery = useAppQuery(
  (options) =>
    apiHandler.get<DataWithPagination<UserProps>>(
      endpoints.management.users,
      options
    ),
  [usersQueryKey]
);

export const useUserQuery = makeUseFetchQuery(
  (id: string, options) =>
    apiHandler.get<UserProps>(`${endpoints.management.users}/${id}`, options),
  [usersQueryKey]
);

export const useUpdateUser = useAppMutation(
  (payload: { userId: string; data: Partial<UserProps> }) =>
    apiHandler.patch(
      `${endpoints.management.users}/${payload.userId}`,
      payload.data
    ),
  [usersQueryKey]
);
