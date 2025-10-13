'use client';
import { useEffect, useState } from 'react';

export interface UseInViewOption extends Partial<IntersectionObserverInit> {
  triggerOnce: boolean;
}

export const useInView = (id: string, options?: Partial<UseInViewOption>) => {
  const [isInView, setIsInView] = useState(false);
  const { triggerOnce = false, ...otherOptions } = options || {};

  useEffect(() => {
    if (!id) return;
    if (triggerOnce && isInView) return;

    const element = document.getElementById(id);
    if (!element) return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (cancelled) return;

        if (entry.isIntersecting) {
          setIsInView(true);

          if (triggerOnce) observer.disconnect();
        } else {
          if (!triggerOnce) setIsInView(false);
        }
      },
      { threshold: 0, ...otherOptions }
    );

    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [id, isInView, JSON.stringify(options || {})]);

  return isInView;
};

export default useInView;
