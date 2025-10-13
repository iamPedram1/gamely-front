'use client';
import { useEffectOnce } from '.';

export const useMount = (fn: () => void) => {
  useEffectOnce(() => {
    fn();
  });
};

export default useMount;
