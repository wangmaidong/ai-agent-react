import type { iAutoColumn } from "../AutoColumn/AutoColumn.utils.tsx";
import { type FormItemProps } from "antd";
import { useAutoTableCellEdit } from "../AutoTable/components/useAutoTableCellEdit.tsx";
import type { PlainObject } from "@peryl/utils/event";
import { useMemo } from "react";

export function AutoFormItem(props: {
  col: iAutoColumn,
  record: PlainObject,
  index: number,
}) {
  const externalFormItemProps = useMemo((): FormItemProps => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    label: String(props.col.title),
    noStyle: false,
  }), [props.col]);
  const { renderFormEditor } = useAutoTableCellEdit({
    col: props.col,
    record: props.record,
    index: props.index,
    externalFormItemProps: externalFormItemProps,
  });
  return renderFormEditor();
}
