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
      width: "120px",
      getDescriptionPrompt: () => `字段名：${col.title}，字段标识：${String(col.dataIndex)}，说明：数据类型为开关，开启值为${trueValue}，关闭值为${falseValue}`,
      inlineRender: ({ value }) => <Switch value={value === trueValue} disabled />,
      inlineEditor: ({ formData, form, dataIndex }) => (
        <span>
          <Switch
            value={formData[dataIndex] === trueValue}
            onChange={val => {form.setFieldValue(dataIndex, val ? trueValue : falseValue);}}
          />
        </span>
      ),
      ...col,
    };
  };
}
