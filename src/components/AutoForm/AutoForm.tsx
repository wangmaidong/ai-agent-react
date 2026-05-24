import type { iAutoColumn } from "../AutoColumn/AutoColumn.utils.tsx";
import React, { useEffect, useImperativeHandle, useMemo, useState } from "react";
import { AutoFormItem } from "./AutoFormItem.tsx";
import type { PlainObject } from "@peryl/utils/event";
import { Form, type FormInstance } from "antd";
import { AutoTableRowContext, type iAutoTableRowProvideContextValue } from "../AutoTable/useAutoTable.utils.tsx";
import "./auto-form.scss";
import { fillWithDefaultColumn } from "../AutoColumn/CreateDefaultColumnConfig.tsx";

export interface iAutoFormProps {
  columns: (iAutoColumn | null | undefined)[];
  record: PlainObject,
  index?: number,
  gridCols?: number,
  onRef?: ({ current?: iAutoFormInstance | null }) | ((refer: iAutoFormInstance | null) => void)
}

export interface iAutoFormInstance {
  form: FormInstance,
  formData: PlainObject,
  availableColumns: iAutoColumn[],
  recordIndex: number,
}

export const AutoForm = React.forwardRef<iAutoFormInstance, iAutoFormProps>((props, ref) => {

  const availableColumns = useMemo((): iAutoColumn[] => {
    // 去掉标准列和没有dataIndex的列，以及数组中的null值
    const availableColumns: iAutoColumn[] = [];
    props.columns.forEach(item => {
      if (!!item && !item.standard && !!item.dataIndex) {
        availableColumns.push(fillWithDefaultColumn(item));
      }
    });
    return availableColumns;
  }, [props.columns]);

  const recordIndex = useMemo(() => props.index ?? 0, [props.index]);

  const gridCols = useMemo(() => props.gridCols ?? 3, [props.gridCols]);

  const [emptyObject] = useState(() => ({}));
  const [form] = Form.useForm();
  const formData = Form.useWatch(null, form) ?? emptyObject;

  const autoTableRowProvideValue = useMemo((): iAutoTableRowProvideContextValue => ({ editable: true, form, formData }), [form, formData]);

  const instance = useMemo((): iAutoFormInstance => (
      { form, formData, availableColumns, recordIndex }),
    [form, formData, availableColumns, recordIndex],
  );

  const { onRef } = props;
  useEffect(() => {
    if (!!onRef) {
      if (typeof onRef === "function") {
        onRef(instance);
      } else {
        onRef.current = instance;
      }
    }
  }, [onRef, instance]);

  useImperativeHandle(ref, () => instance);

  return (
    <div className="auto-form" data-grid-col={gridCols}>
      <Form form={form} initialValues={props.record}>
        <AutoTableRowContext.Provider value={autoTableRowProvideValue}>
          {availableColumns.map((col, index) => (
            <AutoFormItem
              col={col}
              key={String(index + col.dataIndex!)}
              record={props.record}
              index={recordIndex}
            />
          ))}
        </AutoTableRowContext.Provider>
      </Form>
    </div>
  );
});
