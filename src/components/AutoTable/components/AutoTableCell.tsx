import type { PlainObject } from "@peryl/utils/event.ts";
import type { iAutoColumn } from "../../AutoColumn/AutoColumn.utils.tsx";
import { useAutoTableRowContext } from "../useAutoTable.utils.tsx";
import { Form } from "antd";
import { useMemo } from "react";
import type { Rule } from "antd/es/form";

export const AutoTableCell = (props: {
  value: any, record: PlainObject, index: number,
  col: iAutoColumn,
}) => {

  const { editable: rowEditable, form, formData } = useAutoTableRowContext();

  const cellEditable = useMemo(() => {
    if (props.col.editable == null) {return rowEditable;}
    const record = rowEditable ? formData : props.record;
    const colEditable = typeof props.col.editable === "function" ? props.col.editable(record, props.index) : props.col.editable;
    if (colEditable != null) {return colEditable;}
    return rowEditable;
  }, [props.col, rowEditable, props.record, props.index, formData]);

  const cellRules = useMemo(() => {
    const { rules: _rules, required } = props.col;
    let rules: Rule[] = (typeof _rules === "function" ? _rules(formData) : _rules) ?? [];
    if (required) {
      rules.push({ required: true, message: `请填写${props.col.title}` });
    }
    return rules;
  }, [props.col, formData]);

  if (cellEditable) {
    if (!!props.col.inlineEditor) {
      return (
        <Form.Item name={props.col.dataIndex!} noStyle rules={cellRules}>
          {props.col.inlineEditor({
            record: props.record,
            index: props.index,
            dataIndex: props.col.dataIndex!,
            form: form,
            formData: formData,
            rules: [],
          })}
        </Form.Item>
      );
    }
    if (!!props.col.inlineRender) {
      return props.col.inlineRender({
        value: formData[props.col.dataIndex!],
        record: formData,
        index: props.index,
        dataIndex: props.col.dataIndex!,
      });
    }
    return formData[props.col.dataIndex!];
  } else {
    return !props.col.inlineRender ? props.value : props.col.inlineRender?.({
      value: props.value,
      record: props.record,
      index: props.index,
      dataIndex: props.col.dataIndex!,
    });
  }
};
