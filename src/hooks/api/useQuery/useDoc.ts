'use client';
import { useNavigate, useParams } from 'react-router';
import type { DefinedUseQueryResult } from '@tanstack/react-query';

// Hooks
import { useMount, useUpdateEffect } from '@/hooks/utils';

// Custom Utilities
import useBaseQuery from './useBaseQuery';
import { setAlertState } from '@/store/alert';

// Custom Types
import type { CommonResponseProps } from '@/types/api';
import type { AlertProps, UseBaseQueryOptionsProps } from './useBaseQuery';

export type UseDocApiReturnProps<T> = DefinedUseQueryResult<T | null, Error>;
export type UseDocOptionType<T> = Omit<
  UseBaseQueryOptionsProps<T | null>,
  'queryFn' | 'initialData' | 'queryKey' | 'alertOnFetchEmptyList' | 'onFetch'
> & {
  id?: string;
  initialData?: T | null;
  onFetch?: (doc: T) => void;
  /**
   * The URL to redirect to if the document ID is empty.
   * @type {-1 | string}
   */
  redirectAfterDocumentIdIsEmptyTo?: -1 | string;
  /**
   * Alert properties to display when the document ID is empty.
   * @type {AlertProps}
   */
  alertOnDocumentIdIsEmpty?: AlertProps;
};

export function useDocApi<T>(
  queryFn: (id: string, reqInit?: RequestInit) => any,
  queryKey: string[],
  options: UseDocOptionType<T> = {}
) {
  // Props
  const { id, onFetch, ...otherOptions } = options;

  // Hooks
  const navigate = useNavigate();
  const params = useParams();
  const dataId = id
    ? id
    : params && 'id' in params && typeof params.id === 'string'
    ? params.id
    : '';

  const query = useBaseQuery<T | null>({
    ...otherOptions,
    initialData: otherOptions?.initialData || null,
    enabled:
      'enabled' in options
        ? options.enabled
        : dataId && dataId.length > 0
        ? true
        : false,
    queryKey: [...queryKey, dataId],
    queryFn: async ({ signal }) => {
      const response = (await queryFn(dataId, {
        signal,
      })) as CommonResponseProps<T>;

      if (response?.isSuccess) return response;
      else throw new Error(response?.message, { cause: response });
    },
    onFetch: (data) => {
      if (onFetch && data) onFetch(data);
    },
  });

  useMount(() => {
    if (dataId) return;
    if (options.alertOnDocumentIdIsEmpty) {
      setAlertState(
        options.alertOnDocumentIdIsEmpty.message,
        options.alertOnDocumentIdIsEmpty?.severity || 'error'
      );
    }
    if (typeof options?.redirectAfterDocumentIdIsEmptyTo !== 'undefined') {
      setTimeout(
        () => navigate(options.redirectAfterDocumentIdIsEmptyTo as any),
        2500
      );
    }
  });

  useMount(() => {
    if (onFetch && query.data) onFetch(query?.data);
  });

  useUpdateEffect(() => {
    if (onFetch && query.data) onFetch(query?.data);
  }, [query.data]);

  // Utilities
  return query;
}

export default useDocApi;
