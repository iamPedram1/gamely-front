'use client';
import { useEffect, useRef } from 'react';

export const useUpdateEffect = (
  callback: () => void,
  dependencies: unknown[]
): void => {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return callback();
  }, dependencies);
};

export default useUpdateEffect;
