import { useCallback, useEffect, useRef } from "react";

export function useStableCallback<FN extends ((...args: any) => any)>(fn: FN | null | undefined): FN {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const stableFn = useCallback((...args: any[]) => fnRef.current?.(...args), []);

  return stableFn as FN;
}
