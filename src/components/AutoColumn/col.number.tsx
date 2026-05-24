import type { iAutoColumnMapper } from "./AutoColumn.utils.tsx";
import { InputNumber } from "antd";
import { CreateDefaultColumnConfig } from "./CreateDefaultColumnConfig.tsx";

declare module "./AutoColumn.utils.tsx" {
  interface iAutoColumnExpander {number: {};}
}

export type iAutoColumnNumber = iAutoColumnMapper["number"]

export function installColumnNumber() {
  CreateDefaultColumnConfig.number = (col) => {
    const dataIndex = String(col.dataIndex);
    return {
      width: "120px",
      getDescriptionPrompt: () => `字段名：${col.title}，字段标识：${String(col.dataIndex)}，说明：数据类型为数字`,
      filterOption: {
        filterType: "number" as const,
        filterSubType: "range",
        field: dataIndex,
        label: String(col.title),
        filterStartField: dataIndex + "FilterStart",
        filterEndField: dataIndex + "FilterEnd",
      },
      inlineRender: ({ value }) => value,
      inlineEditor: () => <InputNumber />,
      ...col,
    };
  };
}
