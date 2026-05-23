import type { iAutoColumnMapper } from "../../../AutoColumn/AutoColumn.utils.tsx";
import { CheckTitleRender } from "./CheckTitleRender.tsx";
import { CheckInlineRender } from "./CheckInlineRender.tsx";
import { CreateDefaultColumnConfig } from "../../../AutoColumn/CreateDefaultColumnConfig.tsx";

declare module "../../../AutoColumn/AutoColumn.utils.tsx" {
  interface iAutoColumnExpander {check: {};}
}

export type iAutoColumnCheck = iAutoColumnMapper["check"]

export function installColumnCheck() {
  CreateDefaultColumnConfig.check = (col) => {
    return {
      seq: -100,
      width: "50px",
      fixed: "left",
      align: "center",
      title: <CheckTitleRender />,
      dataIndex: "__check__",
      inlineRender: ({ record }) => <CheckInlineRender record={record} />,
      inlineEditor: ({ record }) => <CheckInlineRender record={record} />,
      ...col,
    };
  };
}
