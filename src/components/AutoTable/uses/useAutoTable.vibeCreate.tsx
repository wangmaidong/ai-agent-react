import React, { useCallback, useMemo } from "react";
import type { iAutoTable, iAutoTableConfigButton } from "../useAutoTable.utils.tsx";
import { useCopilotService } from "../../ChatCopilot/useCopilotService.tsx";
import { SignatureOutlined } from "@ant-design/icons";
import { getMultiFormSystemPrompt } from "./useAutoTable.vibeCreate.utils.tsx";
import type { PlainObject } from "@peryl/utils/event";

export function useAutoTableVibeCreate(autoTable: iAutoTable) {

  const {
    methods: { createRecord },
    hooks: { buttonConfigs },
    runningConfig: { showCreateButton },
    state: { renderColumnsRef },
  } = autoTable;

  const { openCopilotService } = useCopilotService();

  const openVibeCreateDrawer = useCallback(() => {
    const { closeModal } = openCopilotService({
      systemPrompt: getMultiFormSystemPrompt(renderColumnsRef.current),
      handleAiMessage: async (message) => {
        const startTag = "/*---DataStart---*/";
        const endTag = "/*---DataEnd---*/";
        if (message.indexOf(endTag) > -1) {
          const startIndex = message.indexOf(startTag);
          const endIndex = message.indexOf(endTag);
          const jsonString = message.slice(startIndex + startTag.length, endIndex);
          const resultDataList: PlainObject[] = JSON.parse(jsonString);
          closeModal();
          console.log(`大模型提取结果：`, resultDataList);
          createRecord(resultDataList);
        }
      },
    });
  }, [openCopilotService, createRecord, renderColumnsRef]);

  /*下拉按钮：智能新建*/
  const vibeCreateButtonConfig = useMemo((): iAutoTableConfigButton | null => !showCreateButton ? null : ({
    seq: 3,
    key: "vibeCreateButton",
    label: "智能新建",
    icon: <SignatureOutlined />,
    dropdownButton: true,
    onClick: openVibeCreateDrawer,
  }), [showCreateButton, openVibeCreateDrawer]);
  // eslint-disable-next-line react-hooks/refs
  buttonConfigs.push(vibeCreateButtonConfig);

  return {
    vibeCreate: { openVibeCreateDrawer },
  };
}

export type iAutoTableVibeCreate = ReturnType<typeof useAutoTableVibeCreate>["vibeCreate"]

declare module "../useAutoTable.utils.tsx" {
  interface iAutoTable {
    vibeCreate: iAutoTableVibeCreate;
  }
}
