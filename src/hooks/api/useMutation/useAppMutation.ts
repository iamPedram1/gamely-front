import { MutationFunction } from '@tanstack/react-query';

// Custom Hooks
import useBaseMutation from './useBaseMutation';

// Custom Types
import type { UseAppBaseMutationOptionProps } from './useBaseMutation';

export const useAppMutation = <TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
  mutationKey: string[]
) => {
  return (
    options?: Omit<
      UseAppBaseMutationOptionProps<TData, Error, TVariables>,
      'mutationFn' | 'mutationKey'
    >
  ) => {
    return useBaseMutation<TData, Error, TVariables>({
      ...options,
      mutationFn,
      mutationKey,
    });
  };
};
