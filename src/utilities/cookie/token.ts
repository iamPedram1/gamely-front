// Custom Utilites

import { deleteCookie, getCookie, setCookie } from '@/utilities/cookie';

// Types

export const setToken = (token: string) => {
  setCookie('Token', token);
};

export const clearToken = () => {
  deleteCookie('Token');
};

export const getToken = () => {
  return getCookie('Token');
};
