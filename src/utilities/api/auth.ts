import apiHandler from '@/utilities/api/apiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Types
import type { UserProps } from '@/types/blog';

const authQueryKey = 'auth';
const profileQueryKey = 'profile';

export const useProfileQuery = useAppQuery(
  () => apiHandler.get<UserProps>('/user/profile'),
  [profileQueryKey]
);

export const useUpdateProfileMutation = useAppMutation(
  (payload: Partial<UserProps>) =>
    apiHandler.patch<UserProps>('/user/profile', payload),
  [authQueryKey]
);

export const useLoginMutation = useAppMutation(
  (payload: { email: string; password: string }) =>
    apiHandler.post<{ token: string }>('/auth/login', payload),
  [authQueryKey, profileQueryKey]
);

export const useRegisterMutation = useAppMutation(
  (payload: { name: string; email: string; password: string }) =>
    apiHandler.post<{ token: string }>('/auth/register', payload),
  [authQueryKey, profileQueryKey]
);
