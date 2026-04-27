import { useLocation } from "react-router";
import qs from "qs";
import { useMemo } from "react";

export function useQuerySearch() {
  const locationSearch = useLocation().search;
  return useMemo(() => {
    return qs.parse(locationSearch.startsWith("?") ? locationSearch.slice(1) : locationSearch);
  }, [locationSearch]);
}
