import { OperationInlineRender } from "./OperationInlineRender.tsx";
import { OperationInlineEditor } from "./OperationInlineEditor.tsx";
import { CreateDefaultColumnConfig } from "../../../AutoColumn/CreateDefaultColumnConfig.tsx";

declare module "../../../AutoColumn/AutoColumn.utils.tsx" {
  interface iAutoColumnExpander {operation: {};}
}

export function installColumnOperation() {
  CreateDefaultColumnConfig.operation = (col) => {
    return {
      width: "120px",
      fixed: "right",
      title: "操作列",
      dataIndex: "__operation__",
      inlineRender: ({ record }) => <OperationInlineRender record={record} />,
      inlineEditor: ({ record }) => <OperationInlineEditor record={record} />,
      ...col,
    };
  };
}
