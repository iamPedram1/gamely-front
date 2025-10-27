// Custom Utilites
import { deleteCookie, getCookie, setCookie } from '@/utilities/cookie';
import {
  accessTokenCookieName,
  refreshTokenCookieName,
} from '@/utilities/appVariables';

// Types
export const setAccessToken = (token: string) => {
  setCookie(accessTokenCookieName, token, { path: '/' });
};

export const deleteAccessToken = () => {
  deleteCookie(accessTokenCookieName, { path: '/' });
};

export const getAccessToken = () => {
  return getCookie(accessTokenCookieName);
};

export const setRefreshToken = (token: string) => {
  setCookie(refreshTokenCookieName, token, { path: '/' });
};

export const deleteRefreshToken = () => {
  deleteCookie(refreshTokenCookieName, { path: '/' });
};

export const getRefreshToken = () => {
  return getCookie(refreshTokenCookieName);
};
