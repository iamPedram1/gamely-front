'use client';
import { useState } from 'react';

type Value = boolean | string | number;

/**
 * A custom hook that toggles between two values.
 *
 * @param valueA The first value to toggle between.
 * @param valueB The second value to toggle between.
 * @param initialValue The initial value of the state.
 * @returns An array containing the current state and a function to toggle the state.
 *
 * @example
 * ```jsx
 * import { useToggle } from '@shopify/hooks/state/state';
 *
 * const MyComponent = () => {
 *   const [mode, onToggleMode] = useToggle('create', 'edit');
 *
 *   return (
 *     <div>
 *       <h1>{mode}</h1>
 *       <button onClick={onToggleMode}>Toggle</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useToggle = <T extends Value, U extends Value>(
  valueA: T,
  valueB: U,
  initialValue?: T | U
) => {
  const [state, setState] = useState<T | U | null>(initialValue || null);

  const onToggle = () =>
    setState((prevState) => (prevState === valueA ? valueB : valueA));

  return [state, onToggle] as const;
};

export default useToggle;
