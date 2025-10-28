import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  MutateOptions,
  MutationFunctionContext,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';

// Context
import { getLoadingState, setLoadingState } from '@/store/loading';
import { setAlertState } from '@/store/alert';
import {
  onCloseDialog,
  onOpenDialog,
  OpenDialogConfigType,
} from '@/store/dialog';

// Hooks
import { useUnMount } from '@/hooks/utils';

// Custom Types
import type { UseFormReturn } from 'react-hook-form';
import type { CommonResponseProps } from '@/types/api';
import { isSucceed, type AlertCrudType } from '@/utilities';

interface AutoAlertProps {
  hookFormMethods?: UseFormReturn<any>;
  /**
   * The action type for the alert, indicating the type of CRUD operation.
   * Example values include:
   * - 'create': Indicates a new item has been created.
   * - 'read': Indicates an item has been fetched.
   * - 'update': Indicates an existing item has been updated.
   * - 'delete': Indicates an item has been deleted.
   * - 'edit': Indicates an item has been edited.
   */
  mode: AlertCrudType;
  /**
   * The feature name to be displayed in the alert.
   */
  name: string;
}
interface CustomAlertProps {
  successMessage?: string;
  successSeverity?: any;
  errorMessage: string;
  errorSeverity?: any;
}

export type UseAppBaseMutationOptionProps<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TOnMutateResult = unknown
> = Omit<UseMutationOptions<TData, TError, TVariables>, 'onSuccess'> & {
  onSuccess?: (
    data: Required<TData>,
    variables: TVariables,
    onMutateResult: TOnMutateResult,
    context: MutationFunctionContext
  ) => Promise<unknown> | unknown;
  redirectDelay?: number;
  /**
   * Determines when to revalidate data: 'after-success' or 'after-settled'.
   *
   * default is set to 'after-success'
   */
  revalidateBehavior?: 'after-success' | 'after-settled';
  /**
   * If true, disables the default auto cache revalidator. default is set to false
   */
  noRevalidate?: boolean;
  /**
   * If true, disables the loading state during the mutation. default is set to false
   */
  disableLoading?: boolean;
  /**
   * If true, disables the auto alert after the mutation. default is set to false
   */
  disableAutoAlert?: boolean;
  /**
   * If true, the loading state will persist after the mutation has completed. default is set to false
   */
  stayOnLoadingAfterSuccessMutate?: boolean;
  /**
   * If an object is passed, the mutation alert will be automatically handled with setSuccessCrudAlert and setFailedCrudAlert.
   */
  autoAlert?: AutoAlertProps;
  /**
   * If an object is passed, the mutation alert will be automatically handled with custom severity and message.
   */
  customAlert?: CustomAlertProps;
  /**
   * If an string passed, after the success mutation application will automatically redirect to that path.
   */
  redirectAfterSuccessTo?: string | ((data: Required<TData>) => string);
  /**
   * Specifies the method of redirection after a successful mutation.
   * Can either be 'push' to add a new entry to the history stack,
   * or 'replace' to replace the current entry in the history stack.
   */
  redirectMethod?: 'push' | 'replace';
  /**
   * Configuration for opening a dialog before executing the mutation.
   * This is a partial configuration object, allowing for flexible setup.
   */
  openDialogBeforeMutate?: Partial<OpenDialogConfigType> | null;
  /**
   * If true, shows alerts only on mutation errors. Defaults to false.
   */
  alertOnlyOnError?: boolean;
};

const useBaseMutation = <TData, TError, TVariables>(
  options?: UseAppBaseMutationOptionProps<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> => {
  // Props
  const {
    onSuccess,
    onMutate,
    onSettled,
    disableLoading = false,
    stayOnLoadingAfterSuccessMutate,
    openDialogBeforeMutate = null,
    disableAutoAlert = false,
    noRevalidate = false,
    alertOnlyOnError = false,
    redirectDelay = false,
    redirectMethod = 'push',
    revalidateBehavior = 'after-success',
    mutationKey,
    mutationFn,
    ...otherOptions
  } = options || {};

  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    {
      ...otherOptions,
      mutationKey,
      mutationFn: async (v, c) => {
        if (!mutationFn)
          throw new Error('No Mutation Fn Provided to React Query.');

        const response = (await mutationFn(v, c)) as CommonResponseProps<TData>;

        if (isSucceed(response.statusCode))
          return response as unknown as Required<TData>;
        else throw new Error(response.message, { cause: response });
      },
      onSuccess: (data, variables, onMutateResult, context) => {
        console.log('onSuccess', { data, variables, onMutateResult, context });
        if (!noRevalidate && revalidateBehavior === 'after-success') {
          mutationKey?.forEach((queryKey: any) => {
            console.log('Revalidate', queryKey);
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          });
        }
        if (onSuccess) onSuccess(data, variables, onMutateResult, context);
        if (options?.redirectAfterSuccessTo) {
          setTimeout(() => {
            navigate(
              typeof options.redirectAfterSuccessTo === 'function'
                ? options.redirectAfterSuccessTo(data)
                : (options.redirectAfterSuccessTo as string),
              { replace: redirectMethod === 'replace' }
            );
          }, 2500);
        }
      },
      onMutate: (variables, context) => {
        if (!disableLoading) setLoadingState(true);
        if (onMutate) onMutate(variables, context);
      },
      onSettled: (
        data: any,
        error: any,
        variables,
        context,
        onMutateResult
      ) => {
        console.log('onSettled', {
          data,
          error,
          variables,
          onMutateResult,
          context,
        });
        const message =
          data?.message || error?.cause?.message || error?.cause?.errors?.[0];
        const isSuccess = error && 'message' in error ? false : true;

        if (!noRevalidate && revalidateBehavior === 'after-settled') {
          mutationKey?.forEach((queryKey: any) => {
            console.log('Revalidate', queryKey);
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          });
        }

        if (!disableLoading && !stayOnLoadingAfterSuccessMutate) {
          setLoadingState(false);
        } else if (!isSuccess) {
          setLoadingState(false);
        }

        if (!disableAutoAlert) {
          setAlertState(message, isSuccess ? 'success' : 'error');
        }

        if (onSettled)
          onSettled(data, error, variables, context, onMutateResult);
        if (openDialogBeforeMutate) onCloseDialog();
      },
    },
    queryClient
  );
  const handleMutate = useCallback(
    (
      variables: TVariables,
      options?: MutateOptions<TData, TError, TVariables, unknown> | undefined
    ) => {
      if (openDialogBeforeMutate) {
        onOpenDialog({
          ...openDialogBeforeMutate,
          onSubmit: () => mutation.mutate(variables, options),
        });
      } else {
        mutation.mutate(variables, options);
      }
    },
    [openDialogBeforeMutate]
  );
  const handleMutateAsync = useCallback(
    async (
      variables: TVariables,
      options?: MutateOptions<TData, TError, TVariables, unknown> | undefined
    ) => {
      return new Promise(async (resolve) => {
        if (openDialogBeforeMutate) {
          onOpenDialog({
            ...openDialogBeforeMutate,
            onSubmit: async () => {
              const response = await mutation.mutateAsync(variables, options);
              resolve(response as Required<TData>);
            },
          });
        } else {
          const result = await mutation.mutateAsync(variables, options);
          resolve(result);
        }
      }) as Promise<TData>;
    },
    [openDialogBeforeMutate]
  );

  useUnMount(() => {
    if (getLoadingState()) setLoadingState(false);
  });

  // Return
  return { ...mutation, mutate: handleMutate, mutateAsync: handleMutateAsync };
};

export default useBaseMutation;
