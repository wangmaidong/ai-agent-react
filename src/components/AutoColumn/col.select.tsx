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
      width: "120px",
      filterOption: {
        filterType: "select" as const,
        filterSubType: "in",
        field: String(col.dataIndex),
        label: String(col.title),
        options: options,
      },
      getFilterText: (value): any => {
        if (Array.isArray(value)) {
          return value.map(val => value2label[val] ?? val).join(",");
        } else {
          return value2label[value] ?? value;
        }
      },
      getDescriptionPrompt: (col) => `字段名：${col.title}，字段标识：${String(col.dataIndex)}，说明：数据类型为下拉选择，选项为${JSON.stringify(options)}，需要你提取选项值`,
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
      ...col,
    };
  };
}
