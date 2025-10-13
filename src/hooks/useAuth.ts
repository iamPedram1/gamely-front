import { useCallback } from 'react';

// Utilities
import { useProfileQuery } from '@/utilities/api/auth';
import { clearToken, getToken, setToken } from '@/utilities/cookie/token';
import { UserProps } from '@/types/blog';
import { useNavigate } from 'react-router';

const useAuth = () => {
  const token = getToken();

  const navigate = useNavigate();
  const profile = useProfileQuery({
    enabled: Boolean(token),
    onFetchFailed: () => logout(),
  });

  const logout = useCallback((redirectTo?: string) => {
    clearToken();
    navigate(redirectTo || '/');
  }, []);

  const signin = useCallback((token) => {
    setToken(token);
  }, []);

  return {
    isAuthLoading: profile.isFetching,
    profile: profile.data as UserProps | null,
    isAuthorized: Boolean(profile.data?.id),
    logout,
    signin,
  };
};

export default useAuth;
