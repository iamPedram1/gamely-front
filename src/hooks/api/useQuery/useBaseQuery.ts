import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import {
  DefinedInitialDataOptions,
  QueryKey,
  useQuery,
} from '@tanstack/react-query';

// Custom Hooks
import { useUpdateEffect } from '@/hooks/utils';

// Context
import { setLoadingState } from '@/store/loading';
import { setAlertState } from '@/store/alert';

// Custom Types
import type { CommonResponseProps } from '@/types/api';

export interface AlertProps {
  /**
   * The message to be displayed in the alert.
   */
  message: string;
  /**
   * The severity of the alert (e.g., 'error', 'warning', 'info', 'success').
   */
  severity?: any;
}

type ReactQueryProps<T = any> = Omit<
  DefinedInitialDataOptions<CommonResponseProps<T>, Error, T, QueryKey>,
  'initialData' | 'placeholderData'
>;

export interface UseBaseQueryOptionsProps<T> extends ReactQueryProps<T> {
  initialData?: T;
  placeholderData?: T;
  queries?: Record<string, unknown>;
  /**
   * Indicates whether to disable automatic alerts.
   */
  disableAutoAlert?: boolean;
  /**
   * Callback function that is called when the fetch is successful.
   */
  onFetch?: (data: T) => void;
  /**
   * Callback function that is called when the fetch fails.
   */
  onFetchFailed?: (error: any) => void;
  /**
   * Alert properties to be shown when a fetch error occurs.
   */
  alertOnFetchError?: AlertProps;
  /**
   * Alert properties to be shown when the fetched list is empty.
   */
  alertOnFetchEmptyList?: AlertProps;
  /**
   * If a string is passed, after an error occurs during the fetch,
   * the application will automatically redirect to that path.
   * A value of -1 indicates no redirection.
   */
  redirectAfterErrorTo?: -1 | string;
  /**
   * If a string is passed, after fetching an empty list,
   * the application will automatically redirect to that path.
   * A value of -1 indicates no redirection.
   */
  redirectAfterFetchEmptyListTo?: -1 | string;
  /**
   * Indicates whether to automatically set the application in loading mode.
   */
  autoLoading?: boolean;
  refetchOnQueryChange?: boolean;
}

function useBaseQuery<T = any>(options: UseBaseQueryOptionsProps<T>) {
  // Props
  const {
    alertOnFetchEmptyList,
    redirectAfterErrorTo,
    redirectAfterFetchEmptyListTo,
    autoLoading,
    disableAutoAlert,
    initialData,
    placeholderData,
    queries,
    refetchOnQueryChange,
    onFetchFailed,
    ...otherOptions
  } = options;

  // Hooks
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryKey = useMemo(() => {
    const keys = [...otherOptions.queryKey];
    if (refetchOnQueryChange)
      keys.push(Object.fromEntries(new URLSearchParams(searchParams)));

    return keys;
  }, [otherOptions.queryKey, searchParams, refetchOnQueryChange]);

  const queryFn = useCallback(
    async (context: any) => {
      const { queryKey, signal, query } = context || {};

      const result = await (otherOptions as any)?.queryFn?.({
        ...(signal && { signal }),
        ...(queryKey && { queryKey }),
        query: {
          ...(query || {}),
          ...Object.fromEntries(new URLSearchParams(searchParams)),
          ...queries,
        },
      });

      if (!result.isSuccess) throw new Error(result.message, { cause: result });

      return result;
    },
    [searchParams, queryKey]
  );

  const query = useQuery<CommonResponseProps<T>, any, T | null, any>({
    staleTime: 600000,
    gcTime: 600000,
    ...otherOptions,
    queryFn,
    queryKey,
    ...(initialData && {
      initialData: {
        errors: [],
        isSuccess: false,
        message: '',
        statusCode: -1,
        data: initialData,
      },
    }),
    placeholderData: {
      errors: [],
      isSuccess: false,
      message: '',
      statusCode: -1,
      data: (placeholderData || null) as T,
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    select: (res) => res?.data || null,
  });

  useLayoutEffect(() => {
    if ('enabled' in options ? options.enabled : true) {
      if (autoLoading) setLoadingState(true);
    }

    if (
      ('enabled' in options ? options.enabled : true) &&
      (query.isStale || !query.isFetched)
    )
      query.refetch();
  }, []);

  useUpdateEffect(() => {
    if (refetchOnQueryChange) query.refetch();
  }, [searchParams]);

  useUpdateEffect(() => {
    if (query.isFetched && !query.isFetching) {
      if (autoLoading) setLoadingState(false);
    }

    const data =
      'docs' in (query.data || {}) ? (query.data as any).docs : query.data;

    if (
      query.isFetched &&
      query.isSuccess &&
      Array.isArray(data) &&
      data.length === 0
    ) {
      if (options?.alertOnFetchEmptyList) {
        setAlertState(
          options.alertOnFetchEmptyList.message,
          options.alertOnFetchEmptyList?.severity || 'warning'
        );
        if (redirectAfterFetchEmptyListTo)
          setTimeout(
            () => navigate(redirectAfterFetchEmptyListTo as any),
            2500
          );
      }
    }
  }, [query.isFetching]);

  useUpdateEffect(() => {
    if (query.data && options.onFetch) {
      options.onFetch(query.data);
    }
  }, [query.data, query.isStale, query.dataUpdatedAt]);

  useUpdateEffect(() => {
    if (!query.isError) return;

    if (options?.alertOnFetchError) {
      setAlertState(
        options.alertOnFetchError.message,
        options.alertOnFetchError?.severity || 'error'
      );
    } else {
      if (!disableAutoAlert) setAlertState(query.error.message);
    }
    if (onFetchFailed) onFetchFailed(query.error);
    if (typeof redirectAfterErrorTo !== 'undefined') {
      setTimeout(() => navigate(redirectAfterErrorTo as any), 2500);
    }
  }, [query.status]);

  return query as Omit<typeof query, 'data'> & { data: T };
}

export default useBaseQuery;
