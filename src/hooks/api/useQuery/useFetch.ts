import { useParams } from 'react-router';
import { useMemo, useRef, useState } from 'react';

// Hooks
import { useBoolean } from '@/hooks/state';
import { useUpdateEffect } from '@/hooks/utils';
import useBaseQuery from '@/hooks/api/useQuery/useBaseQuery';

// Utilities
import { isSucceed } from '@/utilities';

// Types
import type { AppRequestInitProps } from '@/utilities/apiHandler';
import type { CommonResponseProps } from '@/types/api';
import type { UseBaseQueryOptionsProps } from '@/hooks/api/useQuery/useBaseQuery';

interface OptionType<T, P = any>
  extends Omit<
    UseBaseQueryOptionsProps<T | null>,
    'queryFn' | 'initialData' | 'queryKey' | 'alertOnFetchEmptyList' | 'onFetch'
  > {
  initialParams?: P;
  initialData?: T | null;
  placeholderData?: T | null;
  onFetch?: (data: T) => void;
  enabled?: boolean;
  onChangeParams?: (params: P) => void;
  redirectAfterParamsEmptyTo?: -1 | string;
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type UnwrapCommonResponse<T> = T extends CommonResponseProps<infer U> ? U : T;

export type UseFetchOptionType<QF extends (...args: any) => any> = OptionType<
  UnwrapCommonResponse<UnwrapPromise<ReturnType<QF>>>, // inner data T
  Parameters<QF>[0]
>;

export function useFetchApi<
  T,
  QF extends (
    params: any,
    reqInit?: AppRequestInitProps
  ) => Promise<CommonResponseProps<T | null>>
>(
  queryFn: QF,
  queryKey: readonly unknown[],
  options?: OptionType<T, Parameters<QF>[0]>
) {
  type Params = Parameters<QF>[0];
  type QueryResponse = CommonResponseProps<T | null>;
  // Props
  const { initialParams, onFetch, onFetchFailed, ...otherOptions } = (options ||
    {}) as OptionType<T, Params>;

  const routerParams = useParams();

  // States
  const [params, setParams] = useState<Params | undefined>(
    initialParams || routerParams?.id
  );
  const enabled = useBoolean(otherOptions.enabled ?? Boolean(params));
  const isChanging = useBoolean();

  // Hooks
  const lastParamsRef = useRef<Params | undefined>(undefined);
  const memoizedQueryKey = useMemo(
    () => [...queryKey, ...(params ? [params] : [])] as readonly unknown[],
    [queryKey, params]
  );

  const baseQuery = useBaseQuery<QueryResponse | null>({
    ...(otherOptions as any),
    queryKey: memoizedQueryKey,
    enabled: enabled.state,
    queryFn: async ({ signal }) => {
      if (params === undefined || params === null)
        throw new Error('Params not provided');

      const response = await queryFn(params, { signal } as AppRequestInitProps);

      const status = response?.statusCode ?? 502;
      if (!isSucceed(status))
        throw new Error(response?.message || 'Request failed');

      return response;
    },
    onFetch: (response) => {
      if (onFetch && response) onFetch(response as T);
    },
  });

  const onChangeParams = (newParams: Params) => {
    const prevLastParams = lastParamsRef.current;

    // 1️⃣ No change detected
    if (newParams === prevLastParams) {
      isChanging.setFalse();
      return;
    }

    // 2️⃣ Params cleared
    if (!newParams) {
      setParams(undefined);
      enabled.setFalse();
      isChanging.setFalse();
      lastParamsRef.current = undefined;
      return;
    }

    // 3️⃣ Params changed
    lastParamsRef.current = newParams;
    setParams(newParams);
    enabled.setTrue();
    isChanging.setTrue();
  };

  useUpdateEffect(() => {
    isChanging.setFalse();
  }, [baseQuery.data, baseQuery.dataUpdatedAt]);

  useUpdateEffect(() => {
    if (options.enabled) enabled.setTrue();
    else enabled.setFalse();
  }, [options?.enabled]);

  return {
    ...baseQuery,
    data: (baseQuery.data ?? null) as T | null,
    params,
    isChanging: isChanging.state,
    onChangeParams,
  };
}

export default useFetchApi;

export function makeUseFetchQuery<
  QF extends (
    p: any,
    req?: AppRequestInitProps
  ) => Promise<CommonResponseProps<any>>
>(
  queryFn: QF,
  queryKey: readonly unknown[],
  topLevelOptions?: UseFetchOptionType<QF>
) {
  type Inner = UnwrapCommonResponse<UnwrapPromise<ReturnType<QF>>>;

  return function useGeneratedFetchQuery(options?: UseFetchOptionType<QF>) {
    const mergedOptions = useMemo(
      () =>
        ({ ...(topLevelOptions as object), ...(options as object) } as
          | UseFetchOptionType<QF>
          | undefined),
      [topLevelOptions, options]
    );

    return useFetchApi<QF extends any ? Inner : never, QF>(queryFn, queryKey, {
      ...(mergedOptions as any),
    });
  };
}
