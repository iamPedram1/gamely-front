import { CommonResponseProps } from '@/types/api';
import { getCookie } from '@/utilities/cookie';

export interface RequestInitPropsWithAdminIndicator extends RequestInit {
  isAdminSide?: boolean;
  needToken?: boolean;
  noQuery?: boolean;
  queryWhitelistKeyNames?: string[];
}

const baseURL = 'http://localhost:3000/api/v1';

async function appFetch<T = any>(
  endpoint: string,
  reqInit?: RequestInitPropsWithAdminIndicator
): Promise<CommonResponseProps<T>> {
  try {
    const { signal } = reqInit || {};
    const token = getCookie('Token');
    const res = await fetch(`${baseURL}${endpoint}`, {
      ...reqInit,
      credentials: 'include',
      ...(typeof window !== 'undefined' && { signal }),
      headers: {
        ...(token && { 'X-API-KEY': getCookie('Token') }),
        'Content-Type': 'application/json; charset=utf-8',
        ...reqInit?.headers,
      },
      body: reqInit?.body ? JSON.stringify(reqInit?.body || {}) : undefined,
    })
      .then(async (res) => {
        if (res?.ok)
          return res.body
            ? res.json()
            : { statusCode: res.status, isSuccess: res.ok };
        let response: Record<string, any> = {};
        try {
          response = await res.json();
        } catch (error) {
          response.status = res?.status || 502;
        }
        throw new Error('ERROR', { cause: response });
      })
      .then((v) => v);

    const statusCode = res?.statusCode || 502;
    const data = res?.data as T | undefined;
    const isSuccess = res?.isSuccess || false;
    const message = res?.message || '';
    const errors = res?.errors || [];

    return {
      errors,
      statusCode,
      isSuccess,
      data,
      message,
    };
  } catch (error: any) {
    const statusCode = error?.cause?.statusCode || 502;
    const errors = error?.cause?.errors || [];
    const errorMessage =
      error?.cause?.message ||
      error?.cause?.errors?.[0] ||
      'Internal error occured';

    return {
      statusCode,
      errors,
      isSuccess: false,
      message: errorMessage,
    };
  }
}

async function getHandler<T>(
  endpoint: string,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method'>
): Promise<CommonResponseProps<T>> {
  return await appFetch<T>(endpoint, {
    ...reqInit,
    method: 'GET',
    noQuery: reqInit?.noQuery || false,
  });
}

async function postHandler<T>(
  endpoint: string,
  data?: any,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method' | 'body'>
): Promise<CommonResponseProps<T>> {
  return await appFetch<T>(endpoint, {
    ...reqInit,
    method: 'POST',
    body: data,
    noQuery: reqInit?.noQuery || false,
  });
}

async function patchHandler<T>(
  endpoint: string,
  data?: any,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method' | 'body'>
): Promise<CommonResponseProps<T>> {
  return await appFetch<T>(endpoint, {
    ...reqInit,
    method: 'PATCH',
    body: data,
    noQuery: reqInit?.noQuery || false,
  });
}

async function putHandler<T>(
  endpoint: string,
  data?: any,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method' | 'body'>
): Promise<CommonResponseProps<T>> {
  return await appFetch<T>(endpoint, {
    ...reqInit,
    method: 'PUT',
    body: data,
    noQuery: reqInit?.noQuery || false,
  });
}

async function deleteHandler<T>(
  endpoint: string,
  data?: any,
  reqInit?: Omit<RequestInitPropsWithAdminIndicator, 'method'>
): Promise<CommonResponseProps<T>> {
  return await appFetch<T>(endpoint, {
    ...reqInit,
    method: 'DELETE',
    body: data,
    noQuery: reqInit?.noQuery || false,
  });
}

interface ApiHandlerProps {
  post: typeof postHandler;
  patch: typeof patchHandler;
  get: typeof getHandler;
  put: typeof putHandler;
  delete: typeof deleteHandler;
}

const apiHandler: ApiHandlerProps = {
  post: postHandler,
  patch: patchHandler,
  get: getHandler,
  put: putHandler,
  delete: deleteHandler,
};

export default apiHandler;
