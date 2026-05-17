import type { PlainObject } from "@peryl/utils/event";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AutoTableRowContext, useAutoTableContext } from "../useAutoTable.utils.tsx";
import { Form } from "antd";

export function AutoTableRow(props: {
  children?: React.ReactNode,
  record?: PlainObject,
  index?: number
}) {

  const { record, index, ...leftProps } = props;

  const {
    onClickRow: _onClickRow,
    onDoubleClickRow: _onDoubleClickRow,
    editIdMapper,
  } = useAutoTableContext();

  const onClickRow = useCallback((e: React.MouseEvent) => {
    if ((!!record && index != null)) {
      _onClickRow({ e, record, index });
    }
  }, [_onClickRow, record, index]);

  const onDoubleClickRow = useCallback((e: React.MouseEvent) => {
    if ((!!record && index != null)) {
      _onDoubleClickRow({ e, record, index });
    }
  }, [_onDoubleClickRow, record, index]);

  const tableRowContent = useMemo(() => (
      <tr {...leftProps}
          onClick={onClickRow}
          onDoubleClick={onDoubleClickRow}>
        {props.children}
      </tr>),
    [onClickRow, onDoubleClickRow]);

  // 当前行是否开启编辑状态
  const isRowEditing = useMemo(() => !!props.record && !!editIdMapper[props.record.id], [props.record, editIdMapper]);

  const { formInstanceManager } = useAutoTableContext();

  const [form] = Form.useForm();
  const emptyObjRef = useRef({});
  const formData = Form.useWatch(undefined, form) ?? emptyObjRef.current;

  const propsRecord = props.record;

  useEffect(() => {
    if (!!propsRecord) {
      formInstanceManager.set(propsRecord, form);
    }
    return () => {
      if (!!propsRecord) {formInstanceManager.delete(propsRecord);}
    };
  }, [propsRecord, form]);

  useEffect(() => {
    if (!isRowEditing) {
      form.setFieldsValue(propsRecord);
    }
  }, [isRowEditing, form, propsRecord]);

  if (record == null || index == null) {
    return tableRowContent;
  }

  return (
    <AutoTableRowContext.Provider value={{ editable: isRowEditing, form: form, formData: formData }}>
      {(() => {
        if (!isRowEditing || !record || index == null) {
          return tableRowContent;
        } else {
          return (
            <Form form={form} component={false} initialValues={record}>
              {tableRowContent}
            </Form>
          );
        }
      })()}
    </AutoTableRowContext.Provider>
  );
}
