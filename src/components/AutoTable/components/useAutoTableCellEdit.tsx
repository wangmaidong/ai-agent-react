import React, { useCallback, useMemo } from "react";
import type { Rule } from "antd/es/form";
import { useAutoTableRowContext } from "../useAutoTable.utils.tsx";
import type { iAutoColumn, iColEditParam } from "../../AutoColumn/AutoColumn.utils.tsx";
import type { PlainObject } from "@peryl/utils/event.ts";
import { Form, type FormItemProps } from "antd";

export function useAutoTableCellEdit(props: {
  col: iAutoColumn,
  record: PlainObject,
  index: number,
  externalFormItemProps?: FormItemProps,
}) {
  const { editable: rowEditable, form, formData } = useAutoTableRowContext();

  /*计算列是否可以开启编辑状态*/
  const cellEditable = useMemo(() => {
    /*列没有设置动态编辑，用行编辑状态*/
    if (props.col.editable == null) {return rowEditable;}
    /*编辑时用formData，非编辑状态用record*/
    const record = rowEditable ? formData : props.record;
    /*计算列是否可编辑*/
    const colEditable = typeof props.col.editable === "function" ? props.col.editable(record, props.index) : props.col.editable;
    /*有返回值用返回值*/
    if (colEditable != null) {return colEditable;}
    /*没有返回值用行编辑状态*/
    return rowEditable;
  }, [
    props.col, rowEditable,
    props.record, props.index,
    formData,
  ]);

  /*计算列的校验规则*/
  const cellRules = useMemo(() => {
    const { rules: _rules, required } = props.col;
    const rules: Rule[] = [...(typeof _rules === "function" ? _rules(formData) : _rules) ?? []];
    if (required) {rules.push({ required: true, message: `请填写${props.col.title}` });}
    return rules;
  }, [props.col, formData]);

  /*渲染非编辑单元格内容，参数record可能是原始行数据，也可能是编辑的表单数据对象*/
  const renderNormal = useCallback((record: PlainObject, index: number) => {
    const { dataIndex, inlineRender } = props.col;
    const value = record[dataIndex!];
    if (!inlineRender) {
      return String(value ?? "");
    } else {
      return inlineRender({ value: value, record: record, index: index, dataIndex: dataIndex! });
    }
  }, [props.col]);

  /*单元格编辑渲染函数参数*/
  const editParam = useMemo((): iColEditParam => ({
    record: props.record,
    index: props.index,
    formData,
    form,
    dataIndex: props.col.dataIndex!,
    rules: cellRules,
  }), [
    props.record, props.index, cellRules,
    form, formData, props.col.dataIndex,
  ]);

  /*form item props*/
  const formItemProps = useMemo((): FormItemProps => ({
    name: props.col.dataIndex!,
    noStyle: true,
    rules: cellRules,
    ...!props.col.getFormItemProps ? {} : props.col.getFormItemProps({ ...editParam, drawer: false }),
    ...props.externalFormItemProps,
  }), [
    props.col, cellRules,
    editParam, props.externalFormItemProps,
  ]);

  const renderCellEditor = useCallback(() => {
    /*只要列可编辑，都必须用Form.Item渲染这个单元格，因为某些字段可能自身不可编辑，但是值是其他单元格编辑而来的*/
    /*当前列必须要设置Form.Item，否则无法展示编辑的表单数据*/
    const { inlineEditor } = props.col;
    return (
      <Form.Item {...formItemProps}>
        {(() => {
          // cellEditable=false, rowEditable=true 行可编辑，但是列不可编辑，用 formData渲染
          // 优先用 inlineEditor, 其次是 renderNormal
          if (!cellEditable) {
            return renderNormal(formData, props.index);
          } else {
            if (!!inlineEditor) {return inlineEditor(editParam);}
            return renderNormal(formData, props.index);
          }
        })()}
      </Form.Item>
    );
  }, [
    props.col,
    props.index, formItemProps,
    renderNormal, cellEditable,
    editParam, formData,
  ]);

  const renderFormEditor = useCallback(() => {
    const { formEditor, inlineEditor } = props.col;
    return (
      <Form.Item {...formItemProps}>
        {(() => {
          // cellEditable=false, rowEditable=true 行可编辑，但是列不可编辑，用 formData渲染
          // 优先用 formEditor, 其次inlineEditor, 最后是 renderNormal
          if (!cellEditable) {
            return renderNormal(formData, props.index);
          } else {
            if (formEditor) {return formEditor(editParam);}
            if (inlineEditor) {return inlineEditor(editParam);}
            return renderNormal(formData, props.index);
          }
        })()}
      </Form.Item>
    );
  }, [
    props.col, cellEditable,
    props.index, formItemProps, renderNormal,
    editParam, formData,
  ]);

  return {
    rowEditable,
    cellEditable,
    cellRules,
    form,
    formData,
    renderNormal,
    renderCellEditor,
    renderFormEditor,
  };
}
