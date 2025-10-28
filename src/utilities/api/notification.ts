// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/apiHandler';
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

const notificationsQueryKey = 'nofitications';

export const useNotificationsQuery = useAppQuery(
  () =>
    safeApiHandler.get<DataWithPagination<NotificationProps>>(
      endpoints.notifications
    ),
  [notificationsQueryKey]
);

export const useSeenNotificationMutation = useAppMutation(
  (notificationId: string) =>
    apiHandler.post(`${endpoints.notifications}/${notificationId}/seen`),
  [notificationsQueryKey]
);
