import { type iAutoColumnMapper } from "./AutoColumn.utils.tsx";
import { Input } from "antd";
import React from "react";
import { CreateDefaultColumnConfig } from "./CreateDefaultColumnConfig.tsx";

declare module "./AutoColumn.utils.tsx" {
  export interface iAutoColumnExpander {
    input: {};
  }
}

export type iAutoColumnInput = iAutoColumnMapper["input"]

export function installColumnInput() {
  CreateDefaultColumnConfig.input = (col) => {
    return {
      width: "120px",
      getDescriptionPrompt: () => `字段名：${col.title}，字段标识：${String(col.dataIndex)}，说明：数据类型为文本`,
      filterOption: {
        filterType: "input" as const,
        filterSubType: "like",
        field: String(col.dataIndex),
        label: String(col.title),
      },
      inlineRender: ({ value }) => value,
      inlineEditor: () => <Input />,
      ...col,
    };
  };
}
