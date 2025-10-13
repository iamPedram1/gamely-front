'use client';
import { useState, Dispatch, SetStateAction } from 'react';

/**
 * A custom hook that returns a array with a state and setState  functions.
 *
 * @param defValue The default value for the string state.
 * @returns Returns a array with state and setState func.
 */
export const useString = (
  defValue: string = ''
): [string, Dispatch<SetStateAction<string>>] => {
  // States
  const [state, setState] = useState<string>(defValue);

  // Return
  return [state, setState];
};

export default useString;
