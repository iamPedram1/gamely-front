// Utilities
import endpoints from '@/utilities/endpoints';
import safeApiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { DataWithPagination } from '@/types/api';
import type { NotificationProps } from '@/types/client/blog';

export interface AuthResponseProps {
  accessToken: string;
  refreshToken: string;
}

const notificationsQueryKey = 'notifications';

export const useNotificationsQuery = useAppQuery(
  () =>
    safeApiHandler.get<DataWithPagination<NotificationProps>>(
      endpoints.notifications
    ),
  [notificationsQueryKey]
);

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
    safeApiHandler.delete(`${endpoints.notifications}/${notificationId}/seen`),
  [notificationsQueryKey]
);

export const useDeleteAllNotificationsMutation = useAppMutation(
  () => safeApiHandler.delete(`${endpoints.notifications}/delete/all`),
  [notificationsQueryKey]
);
