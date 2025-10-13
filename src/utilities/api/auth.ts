import apiHandler from '@/utilities/api/apiHandler';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

const authQueryKey = 'auth';

export const useProfileQuery = async () =>
  useAppQuery(() => apiHandler.get('/profile'), [authQueryKey]);

export const useLoginMutation = useAppMutation(
  (payload: { email: string; password: string }) =>
    apiHandler.post<{ token: string }>('/auth/login', payload),
  [authQueryKey]
);

export const useRegisterMutation = useAppMutation(
  (payload: { name: string; email: string; password: string }) =>
    apiHandler.post<{ token: string }>('/auth/register', payload),
  [authQueryKey]
);
