import { ForwardedRef, RefObject, useRef, useEffect } from 'react';

export function reuseForwardedRef<T>(
  forwardedRef: ForwardedRef<T>,
  initialValue: T | null = null
): RefObject<T> {
  const usedRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!forwardedRef) return;
    if (typeof forwardedRef === 'function') {
      forwardedRef(usedRef.current);
    } else {
      forwardedRef.current = usedRef.current;
    }
  }, [forwardedRef, usedRef]);

  return usedRef;
}
