import { type iAutoColumnMapper } from "./AutoColumn.utils.tsx";
import { Switch } from "antd";
import React from "react";
import { CreateDefaultColumnConfig } from "./CreateDefaultColumnConfig.tsx";

declare module "./AutoColumn.utils.tsx" {
  export interface iAutoColumnExpander {
    toggle: { trueValue?: any, falseValue?: any };
  }
}

export type iAutoColumnToggle = iAutoColumnMapper["toggle"]

export function installColumnToggle() {
  CreateDefaultColumnConfig.toggle = (col) => {
    const trueValue = col.trueValue ?? "Y";
    const falseValue = col.falseValue ?? "N";
    return {
      ...col,
      type: "toggle",
      width: "120px",
      inlineRender: ({ value }) => <Switch value={value === trueValue} disabled />,
      inlineEditor: ({ formData, form, dataIndex }) => (
        <span>
          <Switch
            value={formData[dataIndex] === trueValue}
            onChange={val => {form.setFieldValue(dataIndex, val ? trueValue : falseValue);}}
          />
        </span>
      ),
    };
  };
}
