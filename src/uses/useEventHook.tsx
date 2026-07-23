import { useEffect, useRef } from "react";
import { useStableCallback } from "./useStableCallback.tsx";

export function useEventHook<
  T = void,
  iHandler extends ((...args: any[]) => any) = T extends void
    ? (() => void | Promise<void>)
    : ((arg: T) => T | void | Promise<T | void>)
>() {
  const handlersRef = useRef<iHandler[]>([]);

  const use = useStableCallback((handler: iHandler) => {
    useEffect(() => {
      handlersRef.current.push(handler);
      return () => {
        const index = handlersRef.current.indexOf(handler);
        if (index >= 0) handlersRef.current.splice(index, 1);
      };
    }, [handler]);
  });

  const exec = useStableCallback(async (arg?: T) => {
    let prev = arg;
    for (let i = 0; i < handlersRef.current.length; i++) {
      const handler = handlersRef.current[i];
      const next = await handler(prev);
      if (next !== undefined) {
        prev = next;
      }
    }
    return prev;
  });

  return { use, exec };
}
