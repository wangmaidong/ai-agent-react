import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useMemo } from "react";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";
import { Tag } from "antd";

export function useAutoTableFilterText(autoTable: iAutoTable) {

  const renderMeta = useMemo((): iRenderMeta | null => {
    return {
      key: "filterText",
      seq: 3,
      content: (
        <div>
          <Tag>筛选条件展示</Tag>
        </div>
      ),
    };
  }, []);

  autoTable.hooks.bodyRender.use(renderMeta);

  return {
    filterText: {},
  };
}

declare module "../useAutoTable.utils.tsx" {
  export interface iAutoTable {
    filterText: ReturnType<typeof useAutoTableFilterText>["filterText"];
  }
}
