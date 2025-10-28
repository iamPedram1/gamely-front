import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

// Custom Hooks
import { useUpdateEffect } from '@/hooks/utils';

// Context
import { setLoadingState } from '@/store/loading';
import { setAlertState } from '@/store/alert';

// Utilities
import { parseQueryStringToObject } from '@/utilities';

// Custom Types
import type { CommonResponseProps, DataWithPagination } from '@/types/api';

interface AlertProps {
  message: string;
  severity?: any;
}

type ReactQueryProps<T = any> = Omit<
  UseInfiniteQueryOptions<
    DataWithPagination<T>,
    Error,
    DataWithPagination<T>,
    QueryKey,
    number
  >,
  'initialData' | 'placeholderData' | 'queryFn' | 'getNextPageParam'
>;

export interface UseBaseInfiniteQueryOptionsProps<T>
  extends ReactQueryProps<T> {
  initialData?: DataWithPagination<T>;
  placeholderData?: DataWithPagination<T>;
  queries?: Record<string, unknown>;
  disableAutoAlert?: boolean;
  onFetch?: (data: InfiniteData<DataWithPagination<T>>) => void;
  onFetchFailed?: (error: any) => void;
  alertOnFetchError?: AlertProps;
  alertOnFetchEmptyList?: AlertProps;
  redirectAfterErrorTo?: -1 | string;
  redirectAfterFetchEmptyListTo?: -1 | string;
  autoLoading?: boolean;
  refetchOnQueryChange?: boolean;
  queryFn: (context: {
    pageParam: number;
    signal?: AbortSignal;
    queryKey?: QueryKey;
    query?: Record<string, unknown>;
  }) => Promise<CommonResponseProps<DataWithPagination<T>>>;
}

function useBaseInfiniteQuery<T = any>(
  options: UseBaseInfiniteQueryOptionsProps<T>
) {
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
    queryFn: originalQueryFn,
    ...otherOptions
  } = options;
  const enabled = options?.enabled ?? false;

  // Hooks
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryKey = useMemo(() => {
    const keys = [...otherOptions.queryKey];
    if (refetchOnQueryChange)
      keys.push(parseQueryStringToObject(searchParams.toString()));

    return keys;
  }, [otherOptions.queryKey, searchParams, refetchOnQueryChange]);

  const queryFn = useCallback(
    async (context: any) => {
      const { pageParam = 1, signal, queryKey } = context || {};

      const result = await originalQueryFn({
        pageParam,
        ...(signal && { signal }),
        ...(queryKey && { queryKey }),
        query: {
          ...parseQueryStringToObject(searchParams.toString()),
          ...queries,
        },
      });

      if (!result.isSuccess) throw new Error(result.message, { cause: result });

      return result.data;
    },
    [searchParams, queryKey, queries, originalQueryFn]
  );

  const query = useInfiniteQuery<
    DataWithPagination<T>,
    Error,
    InfiniteData<DataWithPagination<T>>,
    QueryKey
  >({
    queryKey,
    queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  useLayoutEffect(() => {
    if (enabled && autoLoading) setLoadingState(true);
    if (enabled && (query.isStale || !query.isFetched)) query.refetch();
  }, []);

  useUpdateEffect(() => {
    if (refetchOnQueryChange) query.refetch();
  }, [searchParams]);

  useUpdateEffect(() => {
    if (query.isFetched && !query.isFetching) {
      if (autoLoading) setLoadingState(false);
    }

    const firstPage = query.data?.pages?.[0];
    if (
      query.isFetched &&
      query.isSuccess &&
      firstPage?.docs &&
      firstPage.docs.length === 0
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
    if (enabled && query.data && options.onFetch) {
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

  return query;
}

export default useBaseInfiniteQuery;
