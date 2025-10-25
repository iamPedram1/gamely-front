// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/apiHandler';
import safeApiHandler from '@/utilities/safeApiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { UserProps } from '@/types/blog';
import type { CommonResponseProps } from '@/types/api';

export interface AuthResponseProps {
  token: string;
  refreshToken: string;
}

const authQueryKey = 'auth';
const profileQueryKey = 'profile';

export const useProfileQuery = useAppQuery(
  () => safeApiHandler.get<UserProps>(endpoints.profile),
  [profileQueryKey, 'me']
);

export const useUpdateProfileMutation = useAppMutation(
  (payload: Partial<UserProps>) =>
    safeApiHandler.patch<UserProps>(endpoints.profile, payload),
  [authQueryKey]
);

export const useLoginMutation = useAppMutation(
  (payload: { email: string; password: string }) =>
    apiHandler.post<AuthResponseProps>(endpoints.login, payload),
  [authQueryKey, profileQueryKey]
);
export const usePasswordRecoveryMutation = useAppMutation(
  (payload: { email: string }) =>
    apiHandler.post<AuthResponseProps>(endpoints.recoverPassword, payload),
  [authQueryKey, profileQueryKey]
);

export const usePasswordChangeMutation = useAppMutation(
  (payload: { recoveryKey: string; password: string }) =>
    apiHandler.post<AuthResponseProps>(endpoints.changePassword, payload),
  [authQueryKey, profileQueryKey]
);

export const useRegisterMutation = useAppMutation(
  (payload: { name: string; email: string; password: string }) =>
    apiHandler.post<AuthResponseProps>(endpoints.register, payload),
  [authQueryKey, profileQueryKey]
);

export const refreshToken = (
  refreshToken: string
): Promise<CommonResponseProps<AuthResponseProps>> => {
  return apiHandler.post(
    endpoints.tokenRefresh,
    { refreshToken },
    { keepalive: true }
  );
};
export const revokeToken = (
  token: string,
  refreshToken: string
): Promise<CommonResponseProps<AuthResponseProps>> => {
  return apiHandler.post(
    endpoints.tokenRevoke,
    { token, refreshToken },
    { keepalive: true }
  );
};
