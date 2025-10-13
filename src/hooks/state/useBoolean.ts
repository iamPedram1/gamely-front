'use client';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export interface UseBooleanReturnProps {
  state: boolean;
  set: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export interface UseBooleanOptionsProps {
  onBeforeSetFalse: () => void;
  onAfterSetFalse: () => void;
  onBeforeSetTrue: () => void;
  onAfterSetTrue: () => void;
  onBeforeToggle: () => void;
  onAfterToggle: () => void;
}

/**
 * A custom hook that manages a boolean state with optional callbacks for state changes.
 *
 * @param {boolean} [defValue=false] - The initial value of the boolean state.
 * @param {Partial<UseBooleanOptionsProps>} [options] - Optional callbacks for state change events.
 * @returns {UseBooleanReturnProps} An object containing the current state, state setter, and utility functions.
 *
 */
export const useBoolean = (
  defValue: boolean = false,
  options?: Partial<UseBooleanOptionsProps>
): UseBooleanReturnProps => {
  // States
  const [state, setState] = useState<boolean>(defValue);
  const {
    onAfterSetFalse,
    onAfterSetTrue,
    onAfterToggle,
    onBeforeSetFalse,
    onBeforeSetTrue,
    onBeforeToggle,
  } = options || {};

  // Utilities
  const handleToggle = useCallback((): void => {
    if (onBeforeToggle) onBeforeToggle();
    setState((v) => !v);
    if (onAfterToggle) onAfterToggle();
  }, [onBeforeSetFalse, onAfterToggle]);

  const handleSetFalse = useCallback((): void => {
    if (onBeforeSetFalse) onBeforeSetFalse();
    setState(false);
    if (onAfterSetFalse) onAfterSetFalse();
  }, [onBeforeSetFalse, onAfterSetFalse]);

  const handleSetTrue = useCallback((): void => {
    if (onBeforeSetTrue) onBeforeSetTrue();
    setState(true);
    if (onAfterSetTrue) onAfterSetTrue();
  }, [options]);

  // Return
  return {
    state,
    set: setState,
    setFalse: handleSetFalse,
    setTrue: handleSetTrue,
    toggle: handleToggle,
  };
};

export default useBoolean;
