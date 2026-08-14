import { useMemo } from "react";
import { type iAutoTable } from "../useAutoTable.utils.tsx";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";
import { AutoTableContent } from "../components/AutoTableContent.tsx";

export function useAutoTableContent(autoTable: iAutoTable) {

  const {
    hooks: { bodyRender },
  } = autoTable;

  const bodyRenderMeta = useMemo((): iRenderMeta => ({
    seq: 4,
    key: "table",
    content: () => (
      <AutoTableContent />
    ),
  }), []);

  bodyRender.use(bodyRenderMeta);

  return {};
}
