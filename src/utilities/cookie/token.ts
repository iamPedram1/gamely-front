// Custom Utilites
import { deleteCookie, getCookie, setCookie } from '@/utilities/cookie';

// Types
export const setToken = (token: string) => {
  setCookie('Token', token, { path: '/' });
};

export const deleteToken = () => {
  deleteCookie('Token');
};

export const getToken = () => {
  return getCookie('Token');
};

export const setRefreshToken = (token: string) => {
  setCookie('Refresh-Token', token, { path: '/' });
};

export const deleteRefreshToken = () => {
  deleteCookie('Refresh-Token');
};

export const getRefreshToken = () => {
  return getCookie('Refresh-Token');
};
