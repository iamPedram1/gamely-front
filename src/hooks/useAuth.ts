import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

// Custom Hooks
import { useBoolean } from '@/hooks/state';

// Utilities
import { revokeToken } from '@/utilities/api/auth';
import { useProfileQuery } from '@/utilities/api/user';
import {
  deleteRefreshToken,
  deleteAccessToken,
  getRefreshToken,
  getAccessToken,
  setRefreshToken,
  setAccessToken,
} from '@/utilities/cookie/token';

// Custom Types
import type { UserProps } from '@/types/client/blog';

const useAuth = () => {
  const isAuthorized = useBoolean();
  const location = useLocation();
  const token = getAccessToken();
  const navigate = useNavigate();

  const profile = useProfileQuery({
    enabled: Boolean(token),
    onFetch: isAuthorized.setTrue,
    onFetchFailed: (err) => {
      if (err.statusCode === 403 || err.statusCode === 401) logout();
    },
    placeholderData: null,
  });

  const logout = useCallback((redirectTo?: string) => {
    revokeToken(getAccessToken(), getRefreshToken());
    deleteAccessToken();
    deleteRefreshToken();
    isAuthorized.setFalse();
    navigate(redirectTo || '/');
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (token && profile.data) isAuthorized.setTrue();
    else isAuthorized.setFalse();
  }, [profile.data, location]);

  const signin = useCallback((token: string, refreshToken: string) => {
    setAccessToken(token);
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
