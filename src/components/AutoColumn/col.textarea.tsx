import type { iAutoColumnMapper } from "./AutoColumn.utils.tsx";
import { Input } from "antd";
import { CreateDefaultColumnConfig } from "./CreateDefaultColumnConfig.tsx";

declare module "./AutoColumn.utils.tsx" {
  interface iAutoColumnExpander {textarea: {};}
}

export type iAutoColumnTextarea = iAutoColumnMapper["textarea"]

export function installColumnTextarea() {
  CreateDefaultColumnConfig.toggle = (col) => {
    return {
      width: "200px",
      getDescriptionPrompt: () => `字段名：${col.title}，字段标识：${String(col.dataIndex)}，说明：数据类型为文本`,
      inlineEditor: () => <Input />,
      formEditor: () => <Input.TextArea />,
      ...col,
    };
  };
}
