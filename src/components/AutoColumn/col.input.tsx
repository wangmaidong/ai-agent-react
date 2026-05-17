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
      ...col,
      width: "120px",
      inlineRender: ({ value }) => value,
      inlineEditor: () => <Input />,
    };
  };
}
