// Utilities
import endpoints from '@/utilities/endpoints';
import safeApiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';
import useBaseInfiniteQuery from '@/hooks/api/useQuery/useBaseInfiniteQuery';

// Types
import type { DataWithPagination } from '@/types/api';
import type { NotificationProps } from '@/types/client/blog';
import type { UseBaseInfiniteQueryOptionsProps } from '@/hooks/api/useQuery/useBaseInfiniteQuery';

export interface AuthResponseProps {
  accessToken: string;
  refreshToken: string;
}

const notificationsQueryKey = 'notifications';

export const getNotifications = () =>
  safeApiHandler.get<DataWithPagination<NotificationProps>>(
    endpoints.notifications
  );

export const useNotificationsQuery = useAppQuery(getNotifications, [
  notificationsQueryKey,
]);

export const useNotificationsInfiniteQuery = (
  options?: Partial<UseBaseInfiniteQueryOptionsProps<NotificationProps>>
) =>
  useBaseInfiniteQuery<NotificationProps>({
    initialPageParam: 1,
    refetchInterval: 60000 * 5,
    queryKey: [notificationsQueryKey],
    queryFn: ({ pageParam }) =>
      safeApiHandler.get<DataWithPagination<NotificationProps>>(
        endpoints.notifications,
        { query: { page: pageParam } }
      ),
    enabled: true,
    ...options,
  });

export const useSeenNotificationMutation = useAppMutation(
  (notificationId: string) =>
    safeApiHandler.post(`${endpoints.notifications}/${notificationId}/seen`),
  [notificationsQueryKey]
);

export const useSeenAllNotificationsMutation = useAppMutation(
  () => safeApiHandler.post(`${endpoints.notifications}/seen/all`),
  [notificationsQueryKey]
);
export const useDeleteNotificationMutation = useAppMutation(
  (notificationId: string) =>
    safeApiHandler.delete(`${endpoints.notifications}/${notificationId}`),
  [notificationsQueryKey]
);

export const useDeleteAllNotificationsMutation = useAppMutation(
  () => safeApiHandler.delete(`${endpoints.notifications}/delete/all`),
  [notificationsQueryKey]
);
