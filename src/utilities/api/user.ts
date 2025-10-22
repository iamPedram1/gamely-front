import apiHandler from '@/utilities/api/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';

// Types
import type { UserProps } from '@/types/blog';
import type { DataWithPagination } from '@/types/api';

const usersQueryKey = 'users';

export const useUsersQuery = useAppQuery(
  (options) => apiHandler.get<DataWithPagination<UserProps>>('/users', options),
  [usersQueryKey]
);

export const useUserQuery = makeUseFetchQuery(
  (id: string, options) =>
    apiHandler.get<DataWithPagination<UserProps>>(`/users/${id}`, options),
  [usersQueryKey]
);

export const useUpdateUser = useAppMutation(
  (payload: { userId: string; data: UserProps }) =>
    apiHandler.patch(`/users/${payload.userId}`, payload.data),
  [usersQueryKey]
);
