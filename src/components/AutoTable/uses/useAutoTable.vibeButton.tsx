import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useCopilotService } from "../../ChatCopilot/useCopilotService.tsx";
import { useCallback, useMemo, useState } from "react";
import { getQueryDescription, type iFilterQueryParam, mergeQueryParam } from "../../AutoFilter/AutoFilter.query.tsx";
import type { iFilterTip } from "../../AutoFilter/AutoFilter.tip.tsx";
import { getAutoTableVibeButtonSystemPrompt } from "./useAutoTable.vibeButton.utils.tsx";
import { extractContentFromTags } from "../../../utils/extractContentFromTags.tsx";
import { delay } from "@peryl/utils/delay";
import { Button, Tooltip } from "antd";

export function useAutoTableVibeButton(autoTable: iAutoTable) {

  const {
    state: { renderColumnsRef },
    methods: { reload },
    hooks: { searchRender, onQueryParam, showTips },
  } = autoTable;

  const { openCopilotService } = useCopilotService();

  const [searchParam, setSearchParam] = useState(null as null | iFilterQueryParam);
  const [searchTip, setSearchTip] = useState(null as null | iFilterTip);
  showTips.push(searchTip);

  onQueryParam.use(
    useCallback((prevQueryParam) => {
      if (!searchParam) {return prevQueryParam;}
      return mergeQueryParam(prevQueryParam, searchParam);
    }, [searchParam]),
  );

  const openVibeDrawer = useCallback(() => {
    const { closeModal } = openCopilotService({
      systemPrompt: getAutoTableVibeButtonSystemPrompt(renderColumnsRef.current),
      handleAiMessage: async (message) => {
        /*---------------------------------------处理Vibe查询-------------------------------------------*/
        const searchJsonString = extractContentFromTags(message, "/*---SearchStart---*/", "/*---SearchEnd---*/");
        if (!!searchJsonString) {
          const searchParam = JSON.parse(searchJsonString);
          setSearchParam(searchParam);
          /*把查询参数翻译成人能看懂的文本*/
          const tipText = await getQueryDescription(searchParam, renderColumnsRef.current);
          setSearchTip({
            text: tipText,
            clear: () => {
              setSearchParam(null);
              setSearchTip(null);
            },
          });
        }
        /*---------------------------------------处理Vibe排序-------------------------------------------*/
        /*---------------------------------------处理Vibe字段配置-------------------------------------------*/

        if (
          !!searchJsonString
          // || !!sortJsonString
          // || !!configJsonString
        ) {
          await delay(23);
          reload();
          closeModal();
        }
      },
    });
  }, [
    reload,
    renderColumnsRef,
    openCopilotService,
  ]);

  searchRender.use(
    useMemo(() => ({
      key: "vibeButton",
      seq: 3,
      content: (
        <Tooltip title="Vibe查询、排序以及字段配置">
          <Button onClick={openVibeDrawer} className="gradient-text" icon={
            <i className="bi bi-soundwave" />
          } />
        </Tooltip>
      ),
    }), [openVibeDrawer]),
  );

  return {
    openVibeDrawer,
  };
}
