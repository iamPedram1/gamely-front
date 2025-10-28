import i18n from '@/utilities/i18n';
import { CommonResponseProps } from '@/types/api';
import { getAppBaseURL } from '@/utilities/appVariables';
import { getCookie } from '@/utilities/cookie';
import {
  filterQueryParamsByWhitelist,
  getUrlWithQueryString,
} from '@/utilities/request';
import { getAccessToken } from '@/utilities/cookie/token';

export interface AppRequestInitProps extends Omit<RequestInit, 'body'> {
  /**
   * The body of the request, represented as a key-value pair object.
   * This is used to send data in POST, PUT, or PATCH requests. The object
   * is automatically serialized to JSON for the request payload.
   * @example `{ username: "user", password: "pass" }`
   */
  body?: Record<string, any>;

  /**
   * An optional token for authentication or authorization purposes.
   * If provided, it overrides the default token retrieved from cookies
   * (e.g., `token` cookie). Typically used for custom or manual authentication
   * in API requests.
   * @default Retrieved from `cookies().get('token')`
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  token?: string;

  /**
   * An optional query object representing additional parameters to be included
   * in the request URL as query strings. The object is serialized and appended
   * to the URL.
   * @example `{ page: 1, limit: 10 }` becomes `?page=1&limit=10`
   */
  query?: Record<string, any>;

  /**
   * A flag indicating whether to sanitize the input data before processing.
   * When true, the request body and query parameters are sanitized to prevent
   * injection attacks or malformed data. Set to false for trusted inputs.
   * @default true
   */
  sanitize?: boolean;

  /**
   * An optional signal to abort the request if needed.
   * Allows cancellation of the fetch request, typically used for timeout or
   * user-initiated cancellation.
   * @example AbortSignal.timeout(5000) // Abort after 5 seconds
   */
  signal?: AbortSignal;

  /**
   * An optional key used for caching or query identification.
   * Useful for integrating with data fetching libraries (e.g., React Query)
   * to uniquely identify a request or cache entry.
   * @example ["settings", { page: 1 }]
   */
  queryKey?: any;

  /**
   * Optional metadata to include with the request.
   * Can be used to pass additional context or configuration to the API handler
   * or middleware, such as request-specific flags or identifiers.
   * @example { userId: "123", sessionId: "abc" }
   */
  meta?: any | undefined;
}

export interface RequestInitPropsWithAdminIndicator
  extends AppRequestInitProps {
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
    const {
      signal,
      noQuery = false,
      isAdminSide = false,
      queryWhitelistKeyNames,
    } = reqInit || {};

    const query = noQuery
      ? {}
      : {
          ...(reqInit?.meta?.query || {}),
          ...(reqInit?.query || {}),
        };
    const queries =
      queryWhitelistKeyNames === undefined
        ? query
        : filterQueryParamsByWhitelist(query, queryWhitelistKeyNames);
    const url = `${baseURL}${endpoint}`;
    const sanitizedUrl = getUrlWithQueryString(url, queries);
    const token = getAccessToken();

    const res = await fetch(sanitizedUrl, {
      ...reqInit,
      credentials: 'include',
      ...(typeof window !== 'undefined' && { signal }),
      headers: {
        'Accept-Language': i18n.language,
        ...(token && { 'X-API-KEY': token }),
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
          if (res.status === 204) {
            return { ...(response || {}), status: res.status };
          } else response.status = res?.status || 502;
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
