'use client';
import { useState, Dispatch, SetStateAction, useCallback } from 'react';

/**
 * A custom hook that returns a array with a state and setState  functions.
 *
 * @param defValue The default value for the string state.
 * @returns Returns a array with state and setState func.
 */

export interface UseNumberReturnProps {
  state: number;
  set: Dispatch<SetStateAction<number>>;
  increment: (by?: number) => void;
  decrement: (by?: number) => void;
}

export const useNumber = (defValue: number = 0): UseNumberReturnProps => {
  // States
  const [state, setState] = useState<number>(defValue);

  // Utilities
  const handleIncrement = useCallback(
    (by: number = 1) => {
      setState((prevVal) => prevVal + by);
    },
    [state]
  );
  const handleDecrement = useCallback(
    (by: number = 1) => {
      setState((prevVal) => prevVal - by);
    },
    [state]
  );

  // Return
  return {
    state,
    set: setState,
    increment: handleIncrement,
    decrement: handleDecrement,
  };
};

export default useNumber;
