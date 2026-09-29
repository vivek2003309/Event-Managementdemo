/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * useInView Hook
 * High-performance Intersection Observer hook for scroll-triggered animations.
 */

import { useState, useEffect, useRef, RefObject } from 'react';

export interface UseInViewOptions {
  /** Threshold at which to trigger (0.0 to 1.0). Default: 0.15 */
  threshold?: number | number[];
  /** Margin around root. Default: '0px 0px -40px 0px' */
  rootMargin?: string;
  /** Whether animation triggers only once. Default: true */
  triggerOnce?: boolean;
  /** Delay before setting inView to true in ms. Default: 0 */
  delay?: number;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean, IntersectionObserverEntry | null] {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState<boolean>(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Graceful fallback for environments without IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    let timeoutId: number | null = null;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        if (observerEntry.isIntersecting) {
          if (delay > 0) {
            timeoutId = window.setTimeout(() => {
              setInView(true);
            }, delay);
          } else {
            setInView(true);
          }

          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          if (timeoutId) window.clearTimeout(timeoutId);
          setInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return [ref, inView, entry];
}
