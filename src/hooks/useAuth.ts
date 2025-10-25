import { useCallback } from 'react';
import { useNavigate } from 'react-router';

// Custom Hooks
import { useBoolean } from '@/hooks/state';

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
  const isAuthorized = useBoolean();

  const token = getToken();

  const navigate = useNavigate();
  const profile = useProfileQuery({
    enabled: Boolean(token),
    onFetch: isAuthorized.setTrue,
    onFetchFailed: () => logout(),
    placeholderData: null,
  });

  const logout = useCallback((redirectTo?: string) => {
    revokeToken(getToken(), getRefreshToken());
    deleteToken();
    deleteRefreshToken();
    isAuthorized.setFalse();
    navigate(redirectTo || '/');
  }, []);

  const signin = useCallback((token: string, refreshToken: string) => {
    setToken(token);
    setRefreshToken(refreshToken);
    isAuthorized.setTrue();
  }, []);

  return {
    isAuthLoading: profile.isFetching,
    profile: profile.data as UserProps | null,
    isAuthorized: isAuthorized.state,
    logout,
    signin,
  };
};

export default useAuth;
