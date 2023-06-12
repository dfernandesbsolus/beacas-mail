import { useCallback, useRef } from 'react';

export function useEventCallback<T extends (...rest: any) => any>(fn: T) {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...rest: Parameters<T>) => {
    return ref.current(...(rest as any));
  }, []) as T;
}
