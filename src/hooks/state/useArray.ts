'use client';
import {
  findAndDelete,
  findAndDeleteByIndex,
  findAndUpdateById,
  findAndUpdateByIndex,
} from '@/utilities';
import { useCallback, useState } from 'react';

export interface UseArrayReturnProps<T> {
  state: T[];
  isEmpty: boolean;
  clear: () => void;
  push: (item: T) => void;
  pop: () => T | undefined;
  unshift: (item: T) => void;
  shift: () => T | undefined;
  set: React.Dispatch<React.SetStateAction<T[]>>;
  deleteByIndex: (index: number) => void;
  deleteById: (id: string) => void;
  updateByIndex: (index: number, onSuccess: (foundedObj: T) => void) => void;
  updateById: (id: string, onSuccess: (foundedObj: T) => void) => void;
}
/**
 * A React hook that provides a stateful array with utility functions for managing its elements.
 *
 * @param defValue (optional) The initial value of the array. Defaults to an empty array.
 *
 * @returns An object containing the following properties:
 *
 * - **state**: The current state of the array.
 * - **set**: A function to update the state of the array.
 * - **push**: A function to add an element at the end of the array.
 * - **pop**: A function to remove an element at the end of the array.
 * - **shift**: A function to remove an element at the start of an array.
 * - **unshift**: A function to add an element at the start of an array.
 * - **deleteByIndex**: A function to delete an element from the array by its index.
 * - **deleteById**: A function to delete an element from the array by its id.
 * - **updateByIndex**: A function to update an element in the array by its index.
 * - **updateById**: A function to update an element in the array by its id.
 *
 **/
export function useArray<T>(defValue: T[] = []): UseArrayReturnProps<T> {
  // States
  const [state, setState] = useState<T[]>(defValue);

  // Utilities
  const handleDeleteByIndex = useCallback(
    (index: number) => {
      setState((prevState) => findAndDeleteByIndex(prevState, index));
    },
    [state]
  );

  const handleDeleteById = useCallback(
    (id: string) => {
      setState((prevState) => findAndDelete(prevState as any[], id));
    },
    [state]
  );

  const handleUpdateById = useCallback(
    (id: string, onSuccess: (foundedObj: T) => void) => {
      setState((prevState) =>
        findAndUpdateById(prevState as any[], id, onSuccess)
      );
    },
    [state]
  );

  const handleUpdateByIndex = useCallback(
    (index: number, onSuccess: (foundedObj: T) => void) => {
      setState((prevState) =>
        findAndUpdateByIndex(prevState as any[], index, onSuccess)
      );
    },
    [state]
  );

  const handlePush = useCallback(
    (item: T) => {
      setState((v) => [...v, item]);
    },
    [state]
  );

  const handleUnshift = useCallback(
    (item: T) => {
      setState((v) => [item, ...v]);
    },
    [state]
  );

  const handleShift = useCallback(() => {
    const deletedItem = state[0];
    setState((prevState) => prevState.slice(1));
    return deletedItem;
  }, [state]);

  const handlePop = useCallback(() => {
    const deletedItem = state[state.length - 1];
    setState((prevState) => prevState.slice(0, -1));
    return deletedItem;
  }, [state]);

  const handleClear = useCallback(() => {
    setState([]);
  }, []);

  // Return
  return {
    state,
    isEmpty: state.length === 0,
    set: setState,
    clear: handleClear,
    push: handlePush,
    pop: handlePop,
    unshift: handleUnshift,
    shift: handleShift,
    deleteById: handleDeleteById,
    deleteByIndex: handleDeleteByIndex,
    updateById: handleUpdateById,
    updateByIndex: handleUpdateByIndex,
  };
}

export default useArray;
