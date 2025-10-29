// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/apiHandler';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { CommonResponseProps } from '@/types/api';

export interface AuthResponseProps {
  accessToken: string;
  refreshToken: string;
}

const authQueryKey = 'auth';
const profileQueryKey = 'profile';

export const useLoginMutation = useAppMutation(
  (payload: { email: string; password: string }) =>
    apiHandler.post<AuthResponseProps>(endpoints.auth.login, payload),
  [authQueryKey, profileQueryKey]
);
export const usePasswordRecoveryMutation = useAppMutation(
  (payload: { email: string }) =>
    apiHandler.post<AuthResponseProps>(endpoints.auth.recoverPassword, payload),
  [authQueryKey, profileQueryKey]
);

export const usePasswordChangeMutation = useAppMutation(
  (payload: { recoveryKey: string; password: string }) =>
    apiHandler.post<AuthResponseProps>(endpoints.auth.changePassword, payload),
  [authQueryKey, profileQueryKey]
);

export const useRegisterMutation = useAppMutation(
  (payload: { username: string; email: string; password: string }) =>
    apiHandler.post<AuthResponseProps>(endpoints.auth.register, payload),
  [authQueryKey, profileQueryKey]
);

export const refreshToken = (
  refreshToken: string
): Promise<CommonResponseProps<AuthResponseProps>> => {
  return apiHandler.post(
    endpoints.auth.tokenRefresh,
    { refreshToken },
    { keepalive: true }
  );
};
export const revokeToken = (
  accessToken: string,
  refreshToken: string
): Promise<CommonResponseProps<AuthResponseProps>> => {
  return apiHandler.post(
    endpoints.auth.tokenRevoke,
    { accessToken, refreshToken },
    { keepalive: true }
  );
};
