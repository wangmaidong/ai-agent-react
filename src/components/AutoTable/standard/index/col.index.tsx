import type { iAutoColumnMapper } from "../../../AutoColumn/AutoColumn.utils.tsx";
import { CreateDefaultColumnConfig } from "../../../AutoColumn/CreateDefaultColumnConfig.tsx";
import { IndexInlineRender } from "./IndexInlineRender.tsx";

declare module "../../../AutoColumn/AutoColumn.utils.tsx" {
  interface iAutoColumnExpander {index: {};}
}

export type iAutoColumnIndex = iAutoColumnMapper["index"]

export function installColumnIndex() {
  CreateDefaultColumnConfig.index = (col) => {
    return {
      seq: -99,
      width: "50px",
      fixed: "left",
      align: "center",
      title: "#",
      dataIndex: "__index__",
      standard: true,
      inlineRender: ({ record }) => <IndexInlineRender record={record} />,
      inlineEditor: ({ record }) => <IndexInlineRender record={record} />,
      ...col,
    };
  };
}
