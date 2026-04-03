import {useEffect, useLayoutEffect} from "react";

export function useMounted(handleMounted: () => void) {
  useEffect(() => {
    Promise.resolve().then(() => {
      handleMounted();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useBeforeUnmount(handleUnmount: () => void) {
  useLayoutEffect(() => {
    return () => {
      handleUnmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
