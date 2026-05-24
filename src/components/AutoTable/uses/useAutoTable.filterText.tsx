import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useMemo } from "react";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";
import { AutoTableTips } from "../components/AutoTableTips.tsx";

export function useAutoTableFilterText(autoTable: iAutoTable) {

  const renderMeta = useMemo((): iRenderMeta | null => {
    return {
      key: "filterText",
      seq: 3,
      content: (<AutoTableTips />),
    };
  }, []);

  autoTable.hooks.bodyRender.use(renderMeta);

  return {};
}
