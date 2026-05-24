import type { iAutoColumnMapper } from "./AutoColumn.utils.tsx";
import { CreateDefaultColumnConfig } from "./CreateDefaultColumnConfig.tsx";

declare module "./AutoColumn.utils.tsx" {
  interface iAutoColumnExpander {text: {};}
}

export type iAutoColumnText = iAutoColumnMapper["text"]

export function installColumnText() {
  CreateDefaultColumnConfig.text = (col) => {
    return {
      width: "120px",
      getDescriptionPrompt: () => `字段名：${col.title}，字段标识：${String(col.dataIndex)}，说明：数据类型为文本`,
      ...col,
    };
  };
}
