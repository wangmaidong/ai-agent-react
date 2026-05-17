import type { PlainObject } from "@peryl/utils/event.ts";
import type { iAutoColumn } from "../../AutoColumn/AutoColumn.utils.tsx";
import { useAutoTableRowContext } from "../useAutoTable.utils.tsx";
import { Form } from "antd";

export const AutoTableCell = (props: {
  value: any, record: PlainObject, index: number,
  col: iAutoColumn,
}) => {

  const { editable, form, formData } = useAutoTableRowContext();

  if (editable) {
    if (!!props.col.inlineEditor) {
      return (
        <Form.Item name={props.col.dataIndex!} noStyle>
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
