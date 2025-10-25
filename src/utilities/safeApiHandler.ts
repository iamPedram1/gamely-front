import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/apiHandler';
import { refreshToken } from '@/utilities/api/auth';
import {
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from '@/utilities/cookie/token';

// Custom Types
import type { CommonResponseProps } from '@/types/api';
import type { AuthResponseProps } from '@/utilities/api/auth';
import type { RequestInitPropsWithAdminIndicator } from '@/utilities/apiHandler';

export const inFlightRefreshes = new Map<
  string,
  Promise<CommonResponseProps<AuthResponseProps>>
>();

async function generateKey(
  token: string,
  refreshToken: string
): Promise<string> {
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${token}:${refreshToken}`)
  );
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function callWithRefresh<T = any>(
  methodCall: (...args: any[]) => Promise<CommonResponseProps<T>>,
  endpoint: string,
  args: any[]
): Promise<CommonResponseProps<T>> {
  const res = await methodCall(...args);

  if (res.isSuccess) return res;

  if (res.statusCode === 401) {
    if (endpoint === endpoints.tokenRefresh) return res;

    const authCookies = { token: getToken(), refreshToken: getRefreshToken() };

    if (!authCookies.token || !authCookies.refreshToken) return handleNoToken();

    const key = await generateKey(authCookies.token, authCookies.refreshToken);
    let refreshPromise = inFlightRefreshes.get(key);

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          return await refreshToken(authCookies.refreshToken);
        } finally {
          inFlightRefreshes.delete(key);
        }
      })();
      inFlightRefreshes.set(key, refreshPromise);
    }

    try {
      const refreshRes = await refreshPromise;

      if (refreshRes.isSuccess) {
        setToken(refreshRes.data.token);
        setRefreshToken(refreshRes.data.refreshToken);

        const retryResult = await methodCall(...args);
        return handleRetry(retryResult);
      } else {
        return handleRefreshFailure(refreshRes);
      }
    } finally {
      inFlightRefreshes.delete(key);
    }
  }

  return res;
}
function handleRetry<T>(retry: CommonResponseProps<T>): CommonResponseProps<T> {
  if (retry.isSuccess) return retry;
  if (retry.statusCode === 401) {
    const message = 'دسترسی منقضی شد — لطفاً مجدداً وارد شوید.';
    return {
      ...retry,
      isSuccess: false,
      message,
      errors: [message],
    };
  }
  return retry;
}

function handleRefreshFailure<T>(
  refreshRes: CommonResponseProps<AuthResponseProps>
): CommonResponseProps<T> {
  const message = 'امکان تازه‌سازی نشست وجود ندارد — لطفا مجدا وارد شوید.';
  return {
    statusCode: refreshRes.statusCode,
    isSuccess: false,
    message,
    errors: refreshRes.errors || [message],
  } as CommonResponseProps<T>;
}

function handleNoToken<T>(): CommonResponseProps<T> {
  const message = 'شناسه کاربر یافت نشد - لطفا وارد حساب شوید';
  return {
    statusCode: 401,
    isSuccess: false,
    message,
    errors: [message],
  } as CommonResponseProps<T>;
}

async function get<T>(
  endpoint: string,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method'>
): Promise<CommonResponseProps<T>> {
  return callWithRefresh<T>(apiHandler.get, endpoint, [endpoint, reqInit]);
}

async function post<T>(
  endpoint: string,
  data?: any,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method' | 'body'>
): Promise<CommonResponseProps<T>> {
  return callWithRefresh<T>(apiHandler.post, endpoint, [
    endpoint,
    data,
    reqInit,
  ]);
}

async function patch<T>(
  endpoint: string,
  data?: any,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method' | 'body'>
): Promise<CommonResponseProps<T>> {
  return callWithRefresh<T>(apiHandler.patch, endpoint, [
    endpoint,
    data,
    reqInit,
  ]);
}

async function put<T>(
  endpoint: string,
  data?: any,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method' | 'body'>
): Promise<CommonResponseProps<T>> {
  return callWithRefresh<T>(apiHandler.put, endpoint, [
    endpoint,
    data,
    reqInit,
  ]);
}

async function del<T>(
  endpoint: string,
  data?: any,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method'>
): Promise<CommonResponseProps<T>> {
  return callWithRefresh<T>(apiHandler.delete, endpoint, [
    endpoint,
    data,
    reqInit,
  ]);
}

const safeApiHandler = {
  get,
  post,
  patch,
  put,
  delete: del,
};

export default safeApiHandler;
