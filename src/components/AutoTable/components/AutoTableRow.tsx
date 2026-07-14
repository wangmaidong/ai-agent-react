import type { PlainObject } from "@peryl/utils/event";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AutoTableRowContext, type iAutoTableRowProvideContextValue, useAutoTableContext } from "../useAutoTable.utils.tsx";
import { Form } from "antd";

export function AutoTableRow(props: {
  children?: React.ReactNode,
  record?: PlainObject,
  index?: number
}) {

  const { record, index, ...leftProps } = props;

  const {
    handler: {
      onClickRow: _onClickRow,
      onDoubleClickRow: _onDoubleClickRow,
    },
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
    [onClickRow, onDoubleClickRow, leftProps, props.children]);

  if (!record || index == null) {
    // 空数据行
    return tableRowContent;
  } else {
    // 数据行
    return (
      <AutoTableRowTarget record={record} index={index}>
        {tableRowContent}
      </AutoTableRowTarget>
    );
  }

}

function AutoTableRowTarget(
  { record, index, children }: {
    record: PlainObject,
    index: number,
    children?: React.ReactNode
  },
) {

  const {
    state: {
      editIdMapper,
      formInstanceManager,
    },
  } = useAutoTableContext();

  const recordRef = useRef(record);
  // eslint-disable-next-line react-hooks/refs
  recordRef.current = record;

  const [form] = Form.useForm();
  const emptyObjRef = useRef({});
  // formData 这个是我们实时编辑的数据对象
  /*
  * props.record 是原始行数据对象（是不可变数据）
  * 要修改这个对象的值，是我们要调用 autoTable.setData 去更新那一行数据之后，这里这个 props.record 才会更新；
  * 在保存完数据，调用 /general/{module}/(insert|update)，用返回的新数据来更新这个data数组中的record行数据对象；
  */
  // eslint-disable-next-line react-hooks/refs
  const formData = Form.useWatch(undefined, form) ?? emptyObjRef.current;
  // console.log({ record: props.record, formData, });

  /*当前行是否为编辑状态*/
  const autoTableRowEditable = useMemo(() => !!editIdMapper[record.id], [editIdMapper, record.id]);

  useEffect(() => {
    if (!!record) {
      formInstanceManager.set(record, form);
    }
    return () => {
      if (!!record) {formInstanceManager.delete(record);}
    };
  }, [record, form, formInstanceManager]);

  useEffect(() => {
    if (!autoTableRowEditable) {
      form.setFieldsValue(recordRef.current);
    }
  }, [autoTableRowEditable, form]);

  /*向子孙组件（就是单元格）透传的属性*/
  const autoTableRowProvideValue = useMemo((): iAutoTableRowProvideContextValue => ({
    editable: autoTableRowEditable,
    form,
    formData,
  }), [autoTableRowEditable, form, formData]);

  return (
    <AutoTableRowContext.Provider value={autoTableRowProvideValue}>
      {!autoTableRowEditable ? (children) : (
        <Form form={form} component={false} initialValues={record}>
          {children}
        </Form>
      )}
    </AutoTableRowContext.Provider>
  );
}
