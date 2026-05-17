import { getRowsMapper, type iAutoColumnMapper } from "./AutoColumn.utils.tsx";
import { Form, Select } from "antd";
import React from "react";
import { CreateDefaultColumnConfig } from "./CreateDefaultColumnConfig.tsx";

declare module "./AutoColumn.utils.tsx" {
  export interface iAutoColumnExpander {
    select: { options: ({ label: string, value: any }[]) | string[], multiple?: boolean };
  }
}

export type iAutoColumnSelect = iAutoColumnMapper["select"]

export function installColumnSelect() {
  CreateDefaultColumnConfig.select = (col) => {
    const options: { label: string, value: any }[] = col.options.map(item => typeof item === "string" ? { label: item, value: item } : item);
    const value2label = getRowsMapper(options, { key: "value", value: "label" });
    return {
      ...col,
      type: "select",
      width: "120px",
      inlineRender: ({ value }) => {
        if (value == null || value.trim() === "") { return null; }
        const strValue = String(value);
        if (!col.multiple) {
          return <>{value2label[strValue] ?? strValue}</>;
        } else {
          return strValue.split(",").filter(i => i.trim()).map(val => value2label[val] ?? val).join(", ");
        }
      },
      inlineEditor: ({ dataIndex, rules }) => {
        if (!col.multiple) {
          /*单选编辑*/
          return (
            <Form.Item name={dataIndex} noStyle rules={rules}>
              <Select allowClear options={options} />
            </Form.Item>
          );
        } else {
          /*多选编辑*/
          return (
            <Form.Item
              name={dataIndex}
              noStyle
              rules={rules}
              getValueProps={value => ({ value: value?.split(",") ?? [] })}
              getValueFromEvent={values => values.join(",")}
            >
              <Select allowClear mode="multiple" options={options} />
            </Form.Item>
          );
        }
      },
    };
  };
}
