import { useCallback } from 'react';
import { useNavigate } from 'react-router';

// Utilities
import { revokeToken, useProfileQuery } from '@/utilities/api/auth';
import {
  deleteRefreshToken,
  deleteToken,
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from '@/utilities/cookie/token';

// Custom Types
import type { UserProps } from '@/types/blog';

const useAuth = () => {
  const token = getToken();

  const navigate = useNavigate();
  const profile = useProfileQuery({
    enabled: Boolean(token),
    onFetchFailed: () => logout(),
  });

  const logout = useCallback((redirectTo?: string) => {
    revokeToken(getToken(), getRefreshToken());
    deleteToken();
    deleteRefreshToken();
    navigate(redirectTo || '/');
  }, []);

  const signin = useCallback((token: string, refreshToken: string) => {
    setToken(token);
    setRefreshToken(refreshToken);
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
