import { useEffect, useState } from 'react';

/**
 * Custom React hook that executes a handler function when the component unmounts.
 * @param {Function} handler - The function to be executed on unmount.
 * @returns {void}
 */
export const useUnMount = (handler: () => void): void => {
  // States
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Hooks
  useEffect(() => {
    if (!isMounted) return setIsMounted(true);

    return () => {
      if (isMounted) handler();
    };
  }, [isMounted]);
};

export default useUnMount;
