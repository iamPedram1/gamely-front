import React from 'react';
import useBoolean from './useBoolean';

/**
 * Custom hook to detect if a component is mounted (initialized).
 * @returns {boolean} The initialized state and functions to set it to true or false.
 */
export const useInitialized = (): boolean => {
  const initialized = useBoolean();

  React.useEffect(() => {
    if (!initialized.state) initialized.setTrue();
  }, [initialized.state]);

  return initialized.state;
};

export default useInitialized;
