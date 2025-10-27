// Custom Utilites
import { deleteCookie, getCookie, setCookie } from '@/utilities/cookie';

// Types
export const setAccessToken = (token: string) => {
  setCookie('Access-Token', token, { path: '/' });
};

export const deleteAccessToken = () => {
  deleteCookie('Access-Token', { path: '/' });
};

export const getAccessToken = () => {
  return getCookie('Access-Token');
};

export const setRefreshToken = (token: string) => {
  setCookie('Refresh-Token', token, { path: '/' });
};

export const deleteRefreshToken = () => {
  deleteCookie('Refresh-Token', { path: '/' });
};

export const getRefreshToken = () => {
  return getCookie('Refresh-Token');
};
