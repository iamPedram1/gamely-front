import endpoints from '@/utilities/endpoints';
import safeApiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import { makeUseFetchQuery } from '@/hooks/api/useQuery/useFetch';
import useBaseInfiniteQuery from '@/hooks/api/useQuery/useBaseInfiniteQuery';

// Types
import type { DataWithPagination } from '@/types/api';
import type { FollowerProps, UserProps } from '@/types/client/blog';
import type { UseBaseInfiniteQueryOptionsProps } from '@/hooks/api/useQuery/useBaseInfiniteQuery';

export const usersQueryKey = 'user';
export const followersQueryKey = 'followers';
export const followingQueryKey = 'following';

export const useUsersQuery = useAppQuery(
  (options) =>
    safeApiHandler.get<DataWithPagination<UserProps>>(
      endpoints.management.users,
      options
    ),
  [usersQueryKey]
);

export const useUserQuery = makeUseFetchQuery(
  (username: string, options) =>
    safeApiHandler.get<UserProps>(endpoints.user.details(username), options),
  [usersQueryKey]
);

export const useProfileQuery = useAppQuery(
  () => safeApiHandler.get<UserProps>(endpoints.user.profile.index),
  [usersQueryKey, 'me']
);

export const useUpdateProfileMutation = useAppMutation(
  (payload: Partial<UserProps>) =>
    safeApiHandler.patch<UserProps>(endpoints.user.profile.index, payload),
  [usersQueryKey]
);

// Get followers for a user (can be current user or another user)
export const useFollowersInfiniteQuery = (
  username?: string,
  options?: Partial<UseBaseInfiniteQueryOptionsProps<FollowerProps>>
) =>
  useBaseInfiniteQuery<FollowerProps>({
    initialPageParam: 1,
    queryKey: [followersQueryKey, username],
    queryFn: ({ pageParam }) =>
      safeApiHandler.get<DataWithPagination<FollowerProps>>(
        username
          ? endpoints.user.followers(username)
          : endpoints.user.profile.followers,
        { query: { page: pageParam } }
      ),
    enabled: true,
    ...options,
  });

// Get following for a user (can be current user or another user)
export const useFollowingInfiniteQuery = (
  username?: string,
  options?: Partial<UseBaseInfiniteQueryOptionsProps<FollowerProps>>
) =>
  useBaseInfiniteQuery<FollowerProps>({
    initialPageParam: 1,
    queryKey: [followingQueryKey, username],
    queryFn: ({ pageParam }) =>
      safeApiHandler.get<DataWithPagination<FollowerProps>>(
        username
          ? endpoints.user.followings(username)
          : endpoints.user.profile.followings,
        { query: { page: pageParam } }
      ),
    enabled: true,
    ...options,
  });

export const followUser = (username: string) =>
  safeApiHandler.post(endpoints.user.follow(username));

export const unfollowUser = (username: string) =>
  safeApiHandler.delete(endpoints.user.unfollow(username));

export const blockUser = (userId: string) =>
  safeApiHandler.post(endpoints.user.block(userId));

export const unblockUser = (userId: string) =>
  safeApiHandler.delete(endpoints.user.unblock(userId));

export const useFollowUserMutation = useAppMutation(followUser, [
  followingQueryKey,
  usersQueryKey,
]);
export const useUnfollowUserMutation = useAppMutation(unfollowUser, [
  followingQueryKey,
  usersQueryKey,
]);

export const useBlockUserMutation = useAppMutation(blockUser, [usersQueryKey]);
export const useUnblockUserMutation = useAppMutation(unblockUser, [
  usersQueryKey,
]);
